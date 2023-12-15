import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const [species, meta] = await Promise.all([
		fetch(`/api/species/${params.id}`).then((res) => res.json()),
		fetch(`/api/species-metadata/${params.id}`).then((res) => res.json())
	]);
	return { species, meta };
};
