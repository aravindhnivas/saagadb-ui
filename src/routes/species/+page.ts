import type { PageLoad } from './$types';
import { base } from '$app/paths';
import { z } from 'zod';
import specieSchema from '$lib/schemas/species';

export const load: PageLoad = async ({ url, fetch }) => {
	const fetch_species = async () => {
		const substruct = url.searchParams.get('substruct') ?? '';
		const fetch_url_page = `${base}/api/data/species?${new URLSearchParams({ substruct }).toString()}`;
		const res = await fetch(fetch_url_page);
		if (!res.ok) return { species: [] };
		const species = (await res.json()) as z.infer<typeof specieSchema>[];
		return { species };
	};
	return { load: fetch_species() };
};
