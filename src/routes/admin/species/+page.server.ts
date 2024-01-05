import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	name: z.string().min(1),
	iupac_name: z.string().min(1),
	name_formula: z.string().min(1),
	name_html: z.string().min(1),
	smiles: z.string().min(1),
	standard_inchi: z.string().min(1),
	standard_inchi_key: z.string().min(1),
	notes: z.string().min(10).optional()
});

export const load: PageServerLoad = async ({ request }) => {
	// Server API:
	const form = await superValidate(request, schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, schema);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/species/`, {
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
			const message = await res.text();
			console.log(message);
			if (res.status >= 400 && res.status < 599) {
				error(res.status, { message: res.statusText });
			}
			return;
		}

		const res_data = await res.json();

		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
