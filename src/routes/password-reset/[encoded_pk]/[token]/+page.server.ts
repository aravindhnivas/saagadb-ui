import type { Actions, PageServerLoad } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { base } from '$app/paths';
import { PasswordSchema } from './schema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(PasswordSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request, params }) => {
		const form = await superValidate(request, PasswordSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const password = data.password;
		const confirm_password = data.confirm_password;

		if (password !== confirm_password)
			return setError(form, 'confirm_password', 'Passwords do not match');

		const res = await fetch(`${DB_URL}/user/password-reset/${params.encoded_pk}/${params.token}/`, {
			method: 'PATCH',
			body: JSON.stringify({ password }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			return setError(form, 'password', 'Error resetting password');
		}
		// console.log(await res.json());

		redirect(303, `${base}/login?redirectTo=/admin/dashboard/`);
	}
};
