import type { Actions, PageServerLoad } from './$types';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { EmailSchema } from './schema';

export const load: PageServerLoad = async () => {
	const form = await superValidate(EmailSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const form = await superValidate(request, EmailSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		const email = data.email;
		console.log(email, DB_URL);
		const res = await fetch(`${DB_URL}/user/request-password-reset/`, {
			method: 'POST',
			body: JSON.stringify({ email }),
			headers: { 'Content-Type': 'application/json' }
		});
		console.log(await res.text());
		if (!res.ok) {
			setError(form, 'email', 'Invalid email');
			return fail(400, { form });
		}

		return { form };
	}
};
