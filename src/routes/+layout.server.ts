import type { LayoutServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { delete_token } from '$lib/server/cookies';
import { base } from '$app/paths';

export const load: LayoutServerLoad = async ({ locals, fetch, cookies }) => {
	const fetch_user = async () => {
		if (!locals.token) return null;

		let res: Response;

		try {
			res = await fetch(`${DB_URL}/user/me`);

			if (!res.ok) {
				delete_token({ cookies });
				return null;
			}

			const data = (await res.json()) as {
				name: string;
				email: string;
				organization: string;
			};
			return data;
		} catch (error) {
			return null;
		}
	};

	const fetchFunc = async <T>(url: string): Promise<T | null> => {
		const res = await fetch(url);
		if (!res.ok) return null;
		return res.json();
	};

	const [user, linelist] = await Promise.all([
		fetch_user(),
		fetchFunc<{ id: string; linelist_name: string }[]>(`${base}/api/linelist`)
	]);

	return { user, linelist };
};
