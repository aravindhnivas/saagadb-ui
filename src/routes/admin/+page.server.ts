import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, locals, fetch }) => {
	const fetch_user = async (): Promise<{
		name: string;
		email: string;
		organization: string;
	}> => {
		const res = await fetch(`${DB_URL}/user/me`, {
			method: 'GET',
			headers: {
				Authorization: locals.token ? `Token ${locals.token}` : '',
				'Content-Type': 'application/json',
				accept: 'application/json',
				'X-CSRFToken': cookies.get('csrftoken') as string
			}
		});

		if (!res.ok) error(500, 'Could not fetch user data');

		const data = await res.json();
		return data;
	};

	return {
		user: await fetch_user()
	};
};
