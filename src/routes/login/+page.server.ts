import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
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

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const email = data.email;
		const password = data.password;

		const res = await event.fetch(`${DB_URL}/user/token/`, {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		if (res.status !== 200) {
			// console.log(`res.status: ${res.status}, res.statusText: ${res.statusText}`, form);
			return setError(form, 'password', 'Invalid email or password.');
		}
		const { token } = await res.json();

		if (!token) return { form };

		event.cookies.set('token', token, {
			path: '/',
			domain: event.locals.domain,
			maxAge: 60 * 60 * 1,
			httpOnly: true,
			sameSite: 'lax',
			secure: false
		});

		const redirectTo = event.url.searchParams.get('redirectTo');

		if (redirectTo) {
			redirect(303, `/${redirectTo.slice(1)}`);
		} else {
			redirect(303, '/admin');
		}
	}
};
