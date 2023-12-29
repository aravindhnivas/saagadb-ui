import type { LayoutServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
	const fetch_user = async (): Promise<{
		name: string;
		email: string;
		organization: string;
	} | null> => {
		// console.log('fetch_user');
		if (!locals.token) return null;

		const res = await fetch(`${DB_URL}/user/me`);
		if (!res.ok) error(500, 'Could not fetch user data');

		const data = await res.json();
		return data;
	};

	const user = await fetch_user();
	return { user };
};
