import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import { EmailSchema } from './schema';

export const load: PageServerLoad = async () => {
	const form =  await superValidate(zod(EmailSchema));;
	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const form = await superValidate(request, zod(EmailSchema));

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
		const response = await res.json();
		// console.log(await res.text());
		if (!res.ok) {
			setError(form, 'email', response.message);
			return fail(400, { form });
		}

		return { form };
	}
};
