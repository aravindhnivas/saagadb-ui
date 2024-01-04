import type { LayoutServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { error } from '@sveltejs/kit';
import { delete_token } from '$lib/server/cookies';

export const load: LayoutServerLoad = async ({ locals, fetch, cookies }) => {
	const fetch_user = async (): Promise<{
		name: string;
		email: string;
		organization: string;
	} | null> => {
		// console.log('fetch_user');
		if (!locals.token) return null;

		const res = await fetch(`${DB_URL}/user/me`);
		// console.log(DB_URL, res.ok, res.status, res.statusText);
		if (!res.ok) {
			const text = await res.json();
			// console.log(res.status, res.statusText, text);
			// error(res.status, `${res.statusText}: ${text.detail}`);
			delete_token({ cookies });
			return null;
		}

		const data = await res.json();
		return data;
	};

	const user = await fetch_user();
	return { user };
};
