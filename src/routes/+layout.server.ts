import type { LayoutServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { delete_token } from '$lib/server/cookies';

export const load: LayoutServerLoad = async ({ locals, fetch, cookies }) => {
	// console.log('layout.server.ts load()', DB_URL);
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
			console.log('error', error);
			return null;
		}
	};

	const user = await fetch_user();
	return { user };
};
