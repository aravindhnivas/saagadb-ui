import type { PageLoad } from './$types';
export const load: PageLoad = async ({ url, fetch }) => {
	const getSpeciesStruct = async () => {
		const substruct = url.searchParams.get('substruct') ?? '';
		const queryString = new URLSearchParams({ substruct }).toString();
		const fetch_url_page = `/api/species?${queryString}`;
		const res = await fetch(fetch_url_page);
		if (!res.ok) {
			return { species: [] };
		}

		const data = await res.json();
		return data;
	};

	return { species: await getSpeciesStruct() };
};
