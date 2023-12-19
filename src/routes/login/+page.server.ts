import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	email: z.string().email(),
	// password: z.string().min(8)
	password: z.string()
});

export const load: PageServerLoad = async (event) => {
	// Server API:
	const form = await superValidate(event, schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, schema);
		// console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const email = data.email;
		const password = data.password;
		console.log({ email, password });

		// POST to API
		const res = await event.fetch(`${DB_URL}/user/token/`, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, password })
		});

		if (res.status !== 200) {
			console.log(`res.status: ${res.status}, res.statusText: ${res.statusText}`);
			return fail(400, { form });
		}
		const { token } = await res.json();
		console.log({ token });

		return { form };
	}
};
