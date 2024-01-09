import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { set_token } from '$lib/server/cookies';

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export const load: PageServerLoad = async ({ request, locals }) => {
	if (locals.token) {
		redirect(303, '/admin/dashboard');
	}
	// Server API:
	const form = await superValidate(request, schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request, url, cookies }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const email = data.email;
		const password = data.password;

		const res = await fetch(`${DB_URL}/user/token/`, {
			method: 'POST',
			body: JSON.stringify({ email, password })
		});

		if (res.status !== 200) {
			return setError(form, 'password', 'Invalid email or password.');
		}
		const { token } = (await res.json()) as { token: string };

		if (!token) return { form };
		set_token({ cookies, token });

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			redirect(303, `/${redirectTo.slice(1)}`);
		} else {
			redirect(303, '/admin/dashboard');
		}
	}
};
