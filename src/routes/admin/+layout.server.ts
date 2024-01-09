import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const fetchFunc = async (url: string) => {
		const res = await fetch(url);
		if (!res.ok) return [];
		return res.json();
	};

	const [species, linelist] = (await Promise.all([
		fetchFunc(`/api/species`),
		fetchFunc(`/api/linelist`)
	])) as [{ [key: string]: string }[], { id: string; linelist_name: string }[]];

	return { species, linelist };
};
