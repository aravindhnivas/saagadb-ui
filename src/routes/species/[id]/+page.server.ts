import type { PageServerLoad } from './$types';
import { DB_HOST, DB_PORT } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const URL = `http://${DB_HOST}:${DB_PORT}/api/data`;
	// console.log(params);
	const fetchSpecies = async (id: string) => {
		const data = await fetch(`${URL}/species/${id}`);
		const linelists = await data.json();
		return linelists;
	};

	const fetchSpeciesMeta = async (id: string) => {
		const data = await fetch(`${URL}/species-metadata/${id}`);
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
