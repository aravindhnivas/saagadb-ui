import type { LayoutLoad } from './$types';
import { base } from '$app/paths';
import { oO } from '@zmotivat0r/o0';

export const load: LayoutLoad = async ({ fetch }) => {
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

	const fetch_linelist = async () => {
		const [, res] = await oO(fetch(`${base}/api/data/linelist`));
		if (!(res && res?.ok)) return null;
		const data = (await res.json()) as Linelist[];
		return data;
	};

	const [user, linelist] = await Promise.all([fetch_user(), fetch_linelist()]);

	return { user, linelist };
};
