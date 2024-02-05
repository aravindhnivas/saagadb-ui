import { base } from '$app/paths';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, params }) => {
	const fetch_data = async () => {
		const [species, meta] = await Promise.all([
			fetch(`${base}/api/data/species/${params.id}`).then((res) => res.json()),
			fetch(`${base}/api/data/species-metadata?species=${params.id}`).then((res) => res.json())
		]);

		// console.log({ species, meta });
		return { species, meta } as {
			species: Species;
			meta: SpeciesMetadata[];
		};
	};
	return { load_species_metadata: fetch_data() };
};
