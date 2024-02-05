import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const user_res = await fetch(`${base}/api/user/fetch/${params.id}`);
	const user = (await user_res.json()) as User;

	// const res = await fetch(`${base}/api/data/meta-ref-and-species?uploaded_by=${params.id}`);
	// if (!res.ok) return { MetaReference: [], SpeciesMetadata: [] };

	// const ref_and_species = (await res.json()) as {
	// 	MetaReference: MetaReference[];
	// 	SpeciesMetadata: SpeciesMetadata[];
	// };

	return {
		user
		// ref_and_species
	};
};
