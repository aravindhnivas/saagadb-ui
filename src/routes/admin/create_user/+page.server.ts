import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import userSchema from './schema';
import { base } from '$app/paths';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetch_all_staff = await fetch(`${base}/api/user/fetch?is_staff=true`);
	const all_staff = (await fetch_all_staff.json()) as User[];
	const form = await superValidate(userSchema);
	return { form, all_staff };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, userSchema);
		const { approver, ...rest } = form.data;
		const body = { ...rest, approver: approver.split(',').map((f) => parseInt(f)) };
		console.log('posting', body, JSON.stringify(body));
		// const formData = new FormData();
		// for (const key in body) {
		// 	formData.append(key, JSON.stringify(body[key]));
		// }
		// console.log(formData);
		// return { form };
		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/user/create/`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					setError(form, key, value);
				}
				return fail(400, { form });
			} catch (error) {
				console.log('error', error);
			}
			const msg = await res.text();
			message(form, msg);
			return;
		}
		message(form, { type: 'success', text: 'User created' });
		const res_data = await res.json();

		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
