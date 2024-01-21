import { base } from '$app/paths';
import type { PageLoad } from './$types';

interface Reference {
	id: string;
	doi: string;
	ref_url: string;
	bibtex: string;
	notes: string;
}

interface MetaReference {
	id: string;
	meta: string;
	ref: string;
	dipole_moment: boolean;
	spectrum: boolean;
	notes: string;
}

export const load: PageLoad = async ({ fetch, params }) => {
	const fetch_data = async () => {
		const meta_references = (await fetch(
			`${base}/api/data/meta-reference/query?meta_id=${params.metaId}`
		).then((res) => res.json())) as MetaReference[];
		const references = (await Promise.all(
			meta_references.map(({ ref }) =>
				fetch(`${base}/api/data/reference/${ref}`).then((res) => res.json())
			)
		)) as Reference[];
		return { meta_references, references };
	};

	return { load: fetch_data() };
};
