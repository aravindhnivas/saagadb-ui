import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import schema from './schema';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { DB_URL } from '$lib/server';
import { toast } from 'svelte-sonner';
import { base } from '$app/paths';
import { delete_token } from '$lib/server/cookies';

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};

export const actions: Actions = {
	change_password: async ({ request, cookies, fetch }) => {
		const form = await superValidate(request, schema);

		if (!form.valid) return fail(400, { form });

		const res = await fetch(`${DB_URL}/user/change-password/`, {
			method: 'PUT',
			body: JSON.stringify(form.data),
			headers: { 'Content-Type': 'application/json' }
		});

		const res_mg = (await res.json()) as {
			detail: string;
		};

		console.log('res', res.ok, res.status, res.statusText, { res_mg });

		if (!res.ok) {
			message(form, { type: res.ok ? 'success' : 'error', text: res_mg.detail });
			setError(form, 'current_password', res_mg.detail);
			return fail(400, { form });
		}

		// message(form, { type: 'success', text: msg });
		delete_token({ cookies });
		return { form };
	}
};
