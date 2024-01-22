import { base } from '$app/paths';
import type { PageLoad } from './$types';
import { z } from 'zod';
import specieSchema from '$lib/schemas/species';
import { Schemas } from '$lib/schemas/metadata';

export const load: PageLoad = async ({ fetch, params }) => {
	const fetch_data = async () => {
		const [species, meta] = await Promise.all([
			fetch(`${base}/api/data/species/${params.id}`).then((res) => res.json()),
			fetch(`${base}/api/data/species-metadata/query?species_id=${params.id}`).then((res) =>
				res.json()
			)
		]);
		return { species, meta } as {
			species: z.infer<typeof specieSchema>;
			meta: z.infer<(typeof Schemas)['species-metadata']>;
		};
	};
	return { load: fetch_data() };
};
