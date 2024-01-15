import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { Schemas, ids, fileInputs } from './schemas';
import type { SuperValidated } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

export const load: PageServerLoad = async () => {

	const forms: {
		[key: string]: SuperValidated<(typeof Schemas)[number]>;
	} = {};

	for (const id of ids) {
		const schema = Schemas[id];
		forms[id] = await superValidate(schema, { id });
	}

	return { forms };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const metaid = formData.get('__superform_id') as string;
		// console.log('formData', { formData, metaid });

		const form = await superValidate(formData, Schemas[metaid]);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// message(form, { type: 'success', text: 'Form is valid' });
		// return { form };

		console.log('form.valid', form.data, { formData, metaid });
		const fileKeys = fileInputs[metaid];
		const fileData: {
			[key: string]: Buffer;
		} = {};

		for (const key of fileKeys) {
			console.log('key', key);
			const file = formData.get(key.name);
			console.log('file', file);
			if (!(file instanceof File)) {
				if (key.required) {
					return setError(form, key.name, 'File is required');
				}
				continue;
			}
			const contents = await file.arrayBuffer();
			const binaryContent = Buffer.from(contents);
			fileData[key.name] = binaryContent;
		}

		const res = await fetch(`${DB_URL}/data/${metaid}/`, {
			method: 'POST',
			body: JSON.stringify(form.data)
		});

		console.log({
			ok: res.ok,
			status: res.status,
			statusText: res.statusText
		});

		if (!res.ok && res.status === 400) {
			try {
				const msg_json = await res.json();
				console.log('msg_json', msg_json);
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					setError(form, key, value);
				}
				return fail(400, { form });
			} catch (error) {
				console.log('could not parse json', error);
			}
		} 

		let res_data
		if(res.ok && res.status === 200) {
			res_data = await res.json();
			message(form, { type: 'success', text: 'Form submitted succesfully' });
			return { form, response: res_data };
		} else {
			console.log('trying text parsing after 500 Internal error')
			const msg = await res.text();
			console.log({ msg });
			message(form, msg);
			return { form };
		}
	}
};
