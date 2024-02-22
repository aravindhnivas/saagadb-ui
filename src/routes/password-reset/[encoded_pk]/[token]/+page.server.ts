import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { base } from '$app/paths';
import { PasswordSchema } from './schema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(PasswordSchema));
	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request, params }) => {
		const form = await superValidate(request, zod(PasswordSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const { data } = form;
		const password = data.password;

		const res = await fetch(`${DB_URL}/user/password-reset/${params.encoded_pk}/${params.token}/`, {
			method: 'PATCH',
			body: JSON.stringify({ password }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			return setError(form, 'password', 'Error resetting password');
		}
		redirect(303, base + `/login?redirectTo=/admin/dashboard/`);
	}
};
