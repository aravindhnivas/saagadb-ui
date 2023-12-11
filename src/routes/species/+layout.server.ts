import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const fetchLinelist = async () => {
		const data = await fetch(`/api/linelist`);
		const linelists = await data.json();
		return linelists;
	};

	const fetchSpecieslist = async () => {
		const data = await fetch(`/api/species`);
		const specieslist = await data.json();
		return specieslist;
	};
	return {
		species: fetchSpecieslist(),
		linelist: fetchLinelist()
	};
};
