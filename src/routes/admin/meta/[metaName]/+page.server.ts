import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { schemas } from '$lib/server/schemas/meta';

export const load: PageServerLoad = async ({ request, params }) => {
	if (!Object.keys(schemas).includes(params.metaName))
		error(404, { message: `${params.metaName} page is incorrect and not defined in the schemas` });
	// Server API:
	const form = await superValidate(request, schemas[params.metaName]);
	console.log(params.metaName, { form });

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch, params }) => {
		const form = await superValidate(request, schemas[params.metaName]);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const { name, ...restData } = form.data;
		const name_arr = name.split(',').map((s: string) => s.trim());

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/species/`, {
			method: 'POST',
			body: JSON.stringify({ name: name_arr, ...restData })
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
