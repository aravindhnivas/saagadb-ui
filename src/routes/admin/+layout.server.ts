import { base } from '$app/paths';
import { oO } from '@zmotivat0r/o0';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const fetch_user = async () => {
		try {
			const [, res] = await oO(fetch(`${base}/api/user/me`));
			if (!(res && res?.ok)) return null;
			const data = (await res.json()) as User;
			return data;
		} catch (error) {
			return null;
		}
	};

	const user = await fetch_user();
	if (!user) {
		error(403, { title: 'Invalid user', message: 'Invalid User' });
	}

	return { user };
};
