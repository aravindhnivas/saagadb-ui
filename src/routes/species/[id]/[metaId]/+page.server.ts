import type { PageServerLoad } from './$types';
// import { DB_URL } from '$lib/server';
// import { error, redirect } from '@sveltejs/kit';
// import * as _ from 'lodash-es';

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

export const load: PageServerLoad = async ({ fetch, params }) => {
	const meta_references = (await fetch(`/api/meta-reference/query?meta_id=${params.metaId}`).then(
		(res) => res.json()
	)) as MetaReference[];

	const references = (await Promise.all(
		meta_references.map(({ ref }) => fetch(`/api/reference/${ref}`).then((res) => res.json()))
	)) as Reference[];

	return { meta_references, references };
};
