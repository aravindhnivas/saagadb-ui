import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, fetch }) => {
	const fetch_user = async (): Promise<{
		name: string;
		email: string;
		organization: string;
	}> => {
		if (!locals.token) error(500, 'No token found');

		const res = await fetch(`${DB_URL}/user/me`, {
			method: 'GET',
			headers: {
				Authorization: locals.token ? `Token ${locals.token}` : '',
				'Content-Type': 'application/json',
				accept: 'application/json'
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
