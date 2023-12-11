import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const fetchSpecieslist = async () => {
		const data = await fetch('http://localhost:55835/api/data/species');
		const linelists = await data.json();
		return linelists;
	};
	return {
		species: fetchSpecieslist()
	};
};
