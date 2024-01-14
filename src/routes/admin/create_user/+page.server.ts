import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import userSchema from './schema';

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(userSchema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, userSchema);
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
		message(form, { type: 'success', text: 'User created' });
		const res_data = await res.json();

		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
