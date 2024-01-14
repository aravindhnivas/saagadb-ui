import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { schemaSchema } from '$lib/utils/schemas/species';

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(schemaSchema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, schemaSchema);
		// console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const { name, ...restData } = form.data;
		const name_arr = name.split(',').map((s) => s.trim());

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/species/`, {
			method: 'POST',
			body: JSON.stringify({ name: name_arr, ...restData })
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					setError(form, key, value);
				}
				return fail(400, { form });
			} catch (error) {
				console.log('error', error);
			}
			const msg = await res.text();
			message(form, msg);
			return;
		}

		const res_data = await res.json();
		message(form, { type: 'success', text: 'Form submitted succesfully' });
		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
