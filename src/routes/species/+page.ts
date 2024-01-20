import type { PageLoad } from './$types';
import { base } from '$app/paths';

export const load: PageLoad = async ({ url, fetch }) => {
	const fetch_species = async () => {
		const substruct = url.searchParams.get('substruct') ?? '';
		const fetch_url_page = `${base}/api/species?${new URLSearchParams({ substruct }).toString()}`;
		const res = await fetch(fetch_url_page);
		if (!res.ok) return { species: [] };
		const species = await res.json();
		return { species };
	};
	return { load: fetch_species() };
};
