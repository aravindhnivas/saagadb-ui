import type { LayoutServerLoad } from './$types';
import { DB_URL } from '$lib/utils';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const fetchLinelist = async () => {
		const data = await fetch(`${DB_URL}/linelist/`);
		const linelists = await data.json();
		return linelists;
	};

	const fetchSpecieslist = async () => {
		const data = await fetch(`${DB_URL}/species`);
		const specieslist = await data.json();
		return specieslist;
	};
	return {
		species: fetchSpecieslist(),
		linelist: fetchLinelist()
	};
};
