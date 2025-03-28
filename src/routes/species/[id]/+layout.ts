import { base } from '$app/paths';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const fetch_data = async <T>(url: string) => {
		const res = await fetch(url);
		return res.json() as T;
	};

	const fetch_species_and_metadata = async () => {
		const [species, species_metadata] = await Promise.all([
			fetch_data<Species>(`${base}/api/data/species/${params.id}`),
			fetch_data<SpeciesMetadata[]>(`${base}/api/data/species-metadata?species=${params.id}`)
		]);

		const species_metadata_approved = species_metadata.filter((f) => f.status === 'approved');
		const species_metadata_pending = species_metadata.filter((f) => f.status === 'pending');
		return { species, species_metadata, species_metadata_approved, species_metadata_pending };
	};
	return { load_species_metadata: fetch_species_and_metadata() };
};
