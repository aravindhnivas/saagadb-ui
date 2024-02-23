import type { Actions, PageServerLoad } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { set_token } from '$lib/server/cookies';
import { base } from '$app/paths';
import loginSchema from '$lib/schemas/login';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.token) {
		redirect(303, base + '/admin/dashboard');
	}

	const form = await superValidate(loginSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request, url, cookies }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const email = data.email;
		const password = data.password;

		const res = await fetch(`${DB_URL}/user/token/`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			return setError(form, 'password', 'Invalid email or password.');
		}
		const { token } = (await res.json()) as { token: string };

		if (!token) return { form };
		set_token({ cookies, token });

		const redirectTo = url.searchParams.get('redirectTo');

		if (redirectTo) {
			redirect(303, base + `/${redirectTo.slice(1)}`);
		} else {
			redirect(303, base + '/admin/dashboard');
		}
	}
};
