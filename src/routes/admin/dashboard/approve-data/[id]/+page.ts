import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const user_res = await fetch(`${base}/api/user/fetch/${params.id}`);
	const user = (await user_res.json()) as User;

	const fetch_ref_and_species = async () => {
		if (!user?.id) throw new Error('User ID not provided');

		const res = await fetch(
			`${base}/api/data/meta-ref-and-species?uploaded_by=${user.id}&approved=false`
		);
		if (!res.ok) return { MetaReference: [], SpeciesMetadata: [] };

		const ref_and_species = (await res.json()) as {
			MetaReference: MetaReference[];
			SpeciesMetadata: SpeciesMetadata[];
		};

		return ref_and_species;
	};

	return { user, fetch_ref_and_species };
};
