import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const fetch_data = async () => {
		const meta_references = (await fetch(
			`${base}/api/data/meta-reference/query?meta_id=${params.metaId}`
		).then((res) => res.json())) as MetaReference[];
		const references = (await Promise.all(
			meta_references.map(async ({ ref }) => {
				const res = await fetch(`${base}/api/data/reference/${ref}`);
				if (!res.ok) return null;
				const { bibtex, ...restRef } = (await res.json()) as Reference;
				const bibfile = `${base}/uploads/bib/` + bibtex.split('/').at(-1);
				return { ...restRef, bibtex: bibfile };
			})
		)) as Reference[];
		return { meta_references, references };
	};

	return { load_meta_reference: fetch_data(), id: params.metaId };
};
