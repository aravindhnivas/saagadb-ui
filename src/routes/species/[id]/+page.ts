import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const fetch_data = async () => {
		const [species, meta] = await Promise.all([
			fetch(`/api/species/${params.id}`).then((res) => res.json()),
			fetch(`/api/species-metadata/query?species_id=${params.id}`).then((res) => res.json())
		]);
		return { species, meta };
	};
	return { load: fetch_data() };
};
