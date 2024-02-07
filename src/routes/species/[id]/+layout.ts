import { base } from '$app/paths';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const fetch_data = async <T>(url: string) => {
		const res = await fetch(url);
		return res.json() as T;
	};

	const fetch_species_and_metadata = async () => {
		const [species, meta] = await Promise.all([
			fetch_data<Species>(`${base}/api/data/species/${params.id}`),
			fetch_data<SpeciesMetadata[]>(
				`${base}/api/data/species-metadata?species=${params.id}&approved=true`
			)
		]);
		return { species, meta };
	};
	return { load_species_metadata: fetch_species_and_metadata() };
};
