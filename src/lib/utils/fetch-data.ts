import { base } from '$app/paths';

export const fetch_ref_and_species = async (userId: number) => {
	if (!userId) throw new Error('User ID not provided');

	const res = await fetch(`${base}/api/data/meta-ref-and-species?uploaded_by=${userId}`);
	if (!res.ok) return { MetaReference: [], SpeciesMetadata: [] };

	const ref_and_species = (await res.json()) as {
		MetaReference: MetaReference[];
		SpeciesMetadata: SpeciesMetadata[];
	};

	return ref_and_species;
};
