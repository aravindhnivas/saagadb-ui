import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	linelist_name: z.string().min(1).default('string')
});

export const load: PageServerLoad = async ({ request, fetch }) => {
	const form = await superValidate(request, schema);

	return { form };
};

export const actions: Actions = {
	get_linelist: async ({ request, fetch }) => {
		const form = await superValidate(request, schema);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

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
			const message = await res.json();
			console.log(message);
			if (res.status >= 400 && res.status < 599) {
				error(res.status, { message: message?.linelist_name?.[0] || res.statusText });
			}
			// setError(form, message);
			return;
		}

		const res_data = await res.json();

		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
