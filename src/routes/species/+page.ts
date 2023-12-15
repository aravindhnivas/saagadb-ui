import type { PageLoad } from './$types';
export const load: PageLoad = async ({ url, fetch }) => {
	const getSpeciesStruct = async () => {
		const substruct = url.searchParams.get('substruct') ?? '';
		const query = substruct ? `?query=substruct=${encodeURIComponent(substruct)}` : '';
		const fetch_url_page = `/api/species/${query}`;
		console.log({ query, fetch_url_page });
		const res = await fetch(fetch_url_page);
		if (!res.ok) {
			return { species: [] };
		}

		const data = await res.json();
		return data;
	};

	return { species: await getSpeciesStruct() };
};
