import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const [species, linelist] = (await Promise.all([
		fetch(`/api/species`)
			.then((res) => res.json())
			.catch((err) => {
				console.log('error fetching species', err);
				return [];
			}),
		fetch(`/api/linelist`)
			.then((res) => res.json())
			.catch((err) => {
				console.log('error fetching linelist', err);
				return [];
			})
	])) as [string[], { id: string; linelist_name: string }[]];

	console.log({ species, linelist });
	return { species, linelist };

	// const linelist_res = await fetch(`/api/linelist`);
	// if (!linelist_res.ok) return { linelist: [] };

	// const linelist = (await linelist_res.json()) as {
	// 	id: string;
	// 	linelist_name: string;
	// }[];
	// return { linelist };
};
