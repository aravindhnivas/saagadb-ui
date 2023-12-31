import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	linelist_name: z.string().min(1).default('string')
});

export const load: PageServerLoad = async ({ request }) => {
	const form = await superValidate(request, schema);
	return { form };
};

export const actions: Actions = {
	get_linelist: async ({ request, fetch }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, schema);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			console.warn('form not valid');
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}
		// const file = formData.get('file');
		// // console.log('file uploaded', file);
		// if (file instanceof File) {
		// 	// console.log('file', file);
		// 	const contents = await file.arrayBuffer();
		// 	const binaryContent = Buffer.from(contents);
		// 	// const utf8Content = binaryContent.toString('utf8');
		// 	// console.log({ binaryContent, contents, utf8Content });
		// }

		// return { form };
		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/linelist/`, {
			method: 'POST',
			body: JSON.stringify(form.data)
		});
		// const newUrl = res.headers.get('Location');
		// console.log('newUrl', newUrl);
		console.log('return post request from API', {
			ok: res.ok,
			status: res.status,
			statusText: res.statusText
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					setError(form, key, value);
				}
				return setError(form, '', 'Form is invalid');
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
