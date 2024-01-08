import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { schemas, fileInputs } from '$lib/server/schemas/meta';

export const load: PageServerLoad = async ({ request, params }) => {
	if (!Object.keys(schemas).includes(params.metaName))
		error(404, { message: `${params.metaName} page is incorrect and not defined in the schemas` });
	// Server API:
	const form = await superValidate(request, schemas[params.metaName]);
	// console.log(params.metaName, { form });

	// Unless you throw, always return { form } in load and form actions.
	return { form, fileInputs: fileInputs[params.metaName] as { name: string; required: boolean }[] };
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
			// console.log('file', file);
			const contents = await file.arrayBuffer();
			const binaryContent = Buffer.from(contents);
			// const utf8Content = binaryContent.toString('utf8');
			// console.log({ binaryContent, contents, utf8Content });
			fileData[key.name] = binaryContent;
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/${params.metaName}/`, {
			method: 'POST',
			body: JSON.stringify(form.data)
		});

		console.log('return post request from API', {
			ok: res.ok,
			status: res.status,
			statusText: res.statusText
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				const [key, value] = Object.entries(msg_json)[0] as [string, string];
				return setError(form, key, value);
			} catch (error) {
				console.log('error', error);
			}
			const message = await res.text();
			if (res.status >= 400 && res.status < 599) {
				error(res.status, { message });
			}
			return;
		}

		const res_data = await res.json();

		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
