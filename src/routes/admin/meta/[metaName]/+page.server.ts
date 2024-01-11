import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate, message } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { schemas, fileInputs, dropdowns } from '$lib/utils/schemas/meta';

export const load: PageServerLoad = async ({ params }) => {
	if (!Object.keys(schemas).includes(params.metaName))
		error(404, `invalid page requested: ${params.metaName}`);

	const form = await superValidate(schemas[params.metaName], { id: params.metaName });

	const fileInput = fileInputs[params.metaName];
	const dropdown = dropdowns[params.metaName];
	return { form, fileInput, dropdown, id: params.metaName };
};

export const actions: Actions = {
	default: async ({ request, fetch, params }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, schemas[params.metaName]);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		console.log('form.valid', form.data);
		const fileKeys = fileInputs[params.metaName];
		const fileData: {
			[key: string]: Buffer;
		} = {};

		for (const key of fileKeys) {
			const file = formData.get(key.name);
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

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/${params.metaName}/`, {
			method: 'POST',
			body: JSON.stringify(form.data)
		});

		message(form, {
			ok: res.ok,
			status: res.status,
			statusText: res.statusText
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				console.log('msg_json', msg_json);
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					setError(form, key, value);
				}
				return setError(form, '', 'Form is invalid');
			} catch (error) {
				console.log('error', error);
			}

			const msg = await res.text();
			message(form, msg);
			return;
		}

		const res_data = await res.json();

		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
