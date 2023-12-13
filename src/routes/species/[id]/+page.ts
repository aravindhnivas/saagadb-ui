import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const fetchSpecies = async (id: string): Promise<Species> => {
		const data = await fetch(`/api/species/${id}`);
		return await data.json();
	};

	const fetchSpeciesMeta = async (id: string): Promise<Meta> => {
		const data = await fetch(`/api/species-metadata/${id}`);
		return await data.json();
	};

	return {
		species: fetchSpecies(params.id),
		meta: fetchSpeciesMeta(params.id)
	};
};
