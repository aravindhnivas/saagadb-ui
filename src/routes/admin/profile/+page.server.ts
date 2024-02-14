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
	change_password: async ({ request, url, cookies }) => {
		const form = await superValidate(request, schema);
		const user_id = url.searchParams.get('user_id');
		if (!user_id) return fail(400, { form });

		console.log('POST', form.data, { user_id });

		if (!form.valid) return fail(400, { form });

		const res = await fetch(`${DB_URL}/user/change_password/${user_id}/`, {
			method: 'PUT',
			body: JSON.stringify(form.data),
			headers: { 'Content-Type': 'application/json' }
		});

		const { msg } = (await res.json()) as {
			msg: string;
		};

		console.log('res', res.ok, res.status, res.statusText, { msg });

		if (!res.ok) {
			setError(form, 'current_password', msg);
			return fail(400, { form });
		}

		// message(form, { type: 'success', text: msg });
		delete_token({ cookies });
		return { form };
	}
};
