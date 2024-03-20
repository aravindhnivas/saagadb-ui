import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import schema from './schema';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { DB_URL } from '$lib/server';
import { delete_token } from '$lib/server/cookies';

export const load: PageServerLoad = async () => {
	const form_change_password = await superValidate(schema, { id: 'change-password' });
	return { form_change_password };
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
		// console.log('res', res.ok, res.status, res.statusText, { res_mg });
		if (!res.ok) {
			message(form, { type: res.ok ? 'success' : 'error', text: res_mg.detail });
			setError(form, 'current_password', res_mg.detail);
			return fail(400, { form });
		}

		delete_token({ cookies });
		return { form };
	},

	updateProfile: async ({ request, fetch, url }) => {
		const formData = await request.formData();
		const id = url.searchParams.get('id') as string;
		// console.log('formData', formData);

		// return {
		// 	success: false,
		// 	message: 'test message'
		// };

		const res = await fetch(`${DB_URL}/user/fetch/${id}/`, {
			method: 'PATCH',
			body: formData
		});

		if (!res.ok) {
			const msg = (await res.json()) as {
				detail: string;
			};
			console.log('msg', msg);
			return {
				success: false,
				message: msg.detail
			};
		}
		// const data = await res.json();
		// console.log(data);
		return {
			success: res.ok,
			message: 'User updated successfully'
		};
	}
};
