import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
	organization: z.string().min(2).default('saagadb')
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
		const res = await fetch(`${DB_URL}/user/create/`, {
			method: 'POST',
			body: JSON.stringify(form.data)
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				// console.log(Object.entries(msg_json));
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
