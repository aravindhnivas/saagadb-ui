import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Schemas, fileInputs } from '$lib/schemas/metadata';
import type { SuperValidated } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

type FormKeys = keyof typeof Schemas;

export const load: PageServerLoad = async () => {
	
	const forms: Record<FormKeys, SuperValidated<(typeof Schemas)[FormKeys]>> = {
		'species-metadata': await superValidate(zod(Schemas['species-metadata']), {
			id: 'species-metadata'
		}),
		reference: await superValidate(zod(Schemas['reference']), { id: 'reference' }),
		'meta-reference': await superValidate(zod(Schemas['meta-reference']), { id: 'meta-reference' }),
		line: await superValidate(zod(Schemas['line']), { id: 'line' })
	};
	// console.log('forms', forms);
	return { forms };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		console.log('default action called');
		const formData = await request.formData();
		const metaid = formData.get('__superform_id') as FormKeys;
		console.log('formData', { formData, metaid });

		const form = await superValidate(formData, zod(Schemas[metaid]));
		console.log('posting', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const formBody = new FormData();

		// Append the file data
		for (const key of fileInputs[metaid]) {
			const file = formData.get(key.name);
			if (file instanceof File) {
				if (file.name && !file.name.endsWith(key.extension)) {
					// @ts-ignore
					return setError(form, key.name, `File must have extension ${key.extension}`);
				}
				if (!file.name || !file.size) {
					// @ts-ignore
					if (key.required) return setError(form, key.name, 'File is required');
					console.log('file not required', key.name, file, 'skipping...');
					formBody.append(key.name, '');
					continue;
				}
				console.log('append file instance', key.name, 'to formBody');
				formBody.append(key.name, file);
			} else if (typeof file === 'string') {
				if (!file) {
					// @ts-ignore
					if (key.required) return setError(form, key.name, 'File is required');
					console.log('file not required', key.name, file, 'skipping...');
					formBody.append(key.name, '');
					continue;
				}
				console.log('append file string', key.name, 'to formBody');
				const binaryData = new TextEncoder().encode(file);
				const fileInstance = new File([binaryData], `${key.name}${key.extension}`, {
					type: 'application/octet-stream'
				});

				formBody.append(key.name, fileInstance);
			}
		}

		// Append the other form data
		for (const key in form.data) {
			if (formBody.has(key)) continue;
			// @ts-ignore
			formBody.append(key, form.data[key]);
		}

		for (const [key, value] of formBody.entries()) {
			if (value === 'undefined') {
				console.log('undefined value', key, value);
				formBody.set(key, '');
			}
			console.log({ key, value });
		}
		console.log('formBody', Array.from(formBody.entries()));

		const res = await fetch(`${DB_URL}/data/${metaid}/`, {
			method: 'POST',
			body: formBody
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
				if (msg_json.non_field_errors) {
					message(form, { type: 'error', text: msg_json.non_field_errors });
				} else if (msg_json.message && msg_json.error) {
					message(form, { type: 'error', text: `${msg_json.message}: ${msg_json.error.message}` });
				}
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					// @ts-ignore
					setError(form, key, value);
				}
				return fail(400, { form });
			} catch (error) {
				console.log('could not parse json', error);
			}
		}

		let res_data;
		if (res.ok) {
			res_data = await res.json();
			message(form, { type: 'success', text: 'Form submitted succesfully' });
			return { form, response: res_data };
		} else {
			console.log('trying text parsing after 500 Internal error');
			const msg = await res.text();
			console.log({ msg });
			message(form, { type: 'error', text: msg });
			return fail(500, { form });
		}
	}
};
