import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	// console.log(params);
	const fetchSpecies = async (id: string) => {
		const data = await fetch(`http://localhost:55835/api/data/species/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	const fetchSpeciesMeta = async (id: string) => {
		const data = await fetch(`http://localhost:55835/api/data/species-metadata/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	// const species = await fetchSpecies(params.id);
	// console.log(species);
	return {
		species: fetchSpecies(params.id),
		meta: fetchSpeciesMeta(params.id)
	};
};
