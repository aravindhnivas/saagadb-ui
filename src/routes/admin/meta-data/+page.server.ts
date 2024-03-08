import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { Schemas, fileInputs } from '$lib/schemas/metadata';
import type { SuperValidated } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { base } from '$app/paths';

type FormKeys = keyof typeof Schemas;

export const load: PageServerLoad = async ({ fetch }) => {
	const forms: Record<FormKeys, SuperValidated<(typeof Schemas)[FormKeys]>> = {
		'species-metadata': await superValidate(Schemas['species-metadata'], {
			id: 'species-metadata'
		}),
		reference: await superValidate(Schemas['reference'], { id: 'reference' }),
		'meta-reference': await superValidate(Schemas['meta-reference'], { id: 'meta-reference' }),
		line: await superValidate(Schemas['line'], { id: 'line' })
	};

	const fetch_fn = async <T>(url: string) => {
		let response: T[] = [];
		const res = await fetch(url);
		if (res.ok) response = (await res.json()) as T[];
		return response;
	};

	const [species, linelist] = await Promise.all([
		fetch_fn<Species>(`${base}/api/data/species`),
		fetch_fn<Linelist>(`${base}/api/data/linelist`)
	]);

	return { forms, species, linelist };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		console.log('default action called');
		const formData = await request.formData();
		const metaid = formData.get('__superform_id') as FormKeys;
		console.log('formData', { formData, metaid });

		const form = await superValidate(formData, Schemas[metaid]);
		// console.log('posting', form.data);
		// return { form };
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
					return setError(form, key.name, `File must have extension ${key.extension}`);
				}
				if (!file.name || !file.size) {
					if (key.required) return setError(form, key.name, 'File is required');
					console.log('file not required', key.name, file, 'skipping...');
					formBody.append(key.name, '');
					continue;
				}
				console.log('append file instance', key.name, 'to formBody');
				formBody.append(key.name, file);
			} else if (typeof file === 'string') {
				if (!file) {
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
					setError(form, key, value);
				}
				return fail(400, { form });
			} catch (error) {
				console.log('could not parse json', error);
			}
		}

		if (res.ok) {
			// let res_data;
			const response = await res.json();
			console.log('response', response);
			message(form, {
				type: 'success',
				text:
					`Form (${metaid} ${response?.id ? ': with id = ' + response.id : ''}) submitted succesfully` +
					(metaid === 'reference' ? ` for DOI: ${response?.doi}` : '')
			});
			return { form, response };
		} else {
			console.log('trying text parsing after 500 Internal error');
			const msg = await res.text();
			console.log({ msg });
			message(form, { type: 'error', text: msg });
			return fail(500, { form });
		}
	}
};
