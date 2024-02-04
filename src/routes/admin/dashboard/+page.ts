import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const fetch_ref_and_species = async (userId: string | number) => {
		await parent();
		if (!userId) throw new Error('User ID not provided');
		const res = await fetch(`${base}/api/data/meta-ref-and-species?uploaded_by=${userId}`);
		const ref_and_species = (await res.json()) as {
			MetaReference: MetaReference[];
			SpeciesMetadata: SpeciesMetadata[];
		};
		return ref_and_species;
	};

	return {
		fetch_ref_and_species
	};
};
