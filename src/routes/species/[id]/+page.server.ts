import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const fetchSpecies = async (id: string) => {
		const data = await fetch(`/api/species/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	const fetchSpeciesMeta = async (id: string) => {
		const data = await fetch(`/api/species-metadata/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	return {
		species: fetchSpecies(params.id),
		meta: fetchSpeciesMeta(params.id)
	};
};
