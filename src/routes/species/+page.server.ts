import type { PageServerLoad } from './$types';
import { DB_HOST, DB_PORT } from '$env/static/private';

export const load: PageServerLoad = async ({ fetch }) => {
	console.log(DB_PORT);
	const fetchSpecieslist = async () => {
		const data = await fetch(`http://${DB_HOST}:${DB_PORT}/api/data/species`);
		const linelists = await data.json();
		return linelists;
	};
	return {
		species: fetchSpecieslist()
	};
};
