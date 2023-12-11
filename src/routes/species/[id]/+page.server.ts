import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/utils';
export const load: PageServerLoad = async ({ fetch, params }) => {
	const fetchSpecies = async (id: string) => {
		const data = await fetch(`${DB_URL}/species/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	const fetchSpeciesMeta = async (id: string) => {
		const data = await fetch(`${DB_URL}/species-metadata/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	return {
		species: fetchSpecies(params.id),
		meta: fetchSpeciesMeta(params.id)
	};
};
