import type { LayoutLoad } from './$types';
import { base } from '$app/paths';

export const load: LayoutLoad = async ({ fetch }) => {
	const fetch_species = async () => {
		const fetch_url_page = `${base}/api/data/species`;
		const res = await fetch(fetch_url_page);
		if (!res.ok) return { species: [] };
		const species = (await res.json()) as Species[];
		return { species };
	};
	return { load: fetch_species() };
};
