import { base } from '$app/paths';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const fetchFunc = async (url: string) => {
		const res = await fetch(url);
		if (!res.ok) return [];
		return res.json();
	};

	const [species, linelist] = (await Promise.all([
		fetchFunc(`${base}/api/species`),
		fetchFunc(`${base}/api/linelist`)
	])) as [{ [key: string]: string }[], { id: string; linelist_name: string }[]];

	return { species, linelist };
};
