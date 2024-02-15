import { base } from '$app/paths';
import { oO } from '@zmotivat0r/o0';
import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const fetch_user = async () => {
		try {
			const [, res] = await oO(fetch('/api/user/me'));
			if (!(res && res?.ok)) return null;
			const data = (await res.json()) as User;
			return data;
		} catch (error) {
			return null;
		}
	};

	const fetchFunc = async (url: string) => {
		const res = await fetch(url);
		if (!res.ok) return [];
		return res.json();
	};

	const user = await fetch_user();
	if (!user) {
		error(403, { title: 'Invalid user', message: 'Invalid User' });
	}

	const [species, linelist] = (await Promise.all([
		fetchFunc(`${base}/api/data/species`),
		fetchFunc(`${base}/api/data/linelist`)
	])) as [Species[], Linelist[]];

	return { user, species, linelist };
};
