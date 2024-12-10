import { base } from '$app/paths';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { DB_URL } from '$lib/server';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user.is_superuser) {
		error(403, { message: 'Requires superuser permission', title: 'Forbidden' });
	}

	const fetch_all_users = async () => {
		if (!locals.user.is_superuser) return [];
		const all_users_res = await fetch(`${base}/api/user/fetch`);
		if (!all_users_res.ok) return [];
		const all_users: User[] = await all_users_res.json();
		return all_users;
	};
	return {
		all_users: await fetch_all_users()
	};
};

export const actions: Actions = {
	async update_user({ fetch, url, request }) {
		const id = url.searchParams.get('id') as string;

		const formData = await request.formData();
		const formBody = Object.fromEntries(formData.entries()) as {
			name: string;
			email: string;
			is_staff: string;
			approver: string;
		};
		const { approver, ...rest } = formBody;

		// console.log({ formBody });
		const body = approver
			? { ...rest, approver: approver.split(',').map((f) => parseInt(f)) }
			: rest;

		// console.log({ id, body });

		// return {
		// 	success: false,
		// 	message: 'test message'
		// };

		const res = await fetch(`${DB_URL}/user/fetch/${id}/`, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' }
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

		return {
			success: res.ok,
			message: 'User updated successfully'
		};
	}
};
