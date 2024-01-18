import type { Actions, PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { error, redirect } from '@sveltejs/kit';
import * as _ from 'lodash-es';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const fetch_data = async () => {
		const [species, meta] = await Promise.all([
			fetch(`/api/species/${params.id}`).then((res) => res.json()),
			fetch(`/api/species-metadata/query?species_id=${params.id}`).then((res) => res.json())
		]);
		return { species, meta };

		// console.log('species fetched', species);
		// console.log('species-metada fetched', meta.length);

		// const meta_references: { [name: string]: [] } = {};

		// const meta_ref_fetched = await Promise.all(
		// 	meta?.map(({ id: meta_id }) => fetchFunc(`/api/meta-reference`, { meta_id }))
		// );

		// const references: { [name: string]: [] } = {};

		// for (const m of meta_ref_fetched) {
		// 	if (!m) return;
		// 	if (!m[0]) return;
		// 	meta_references[m[0].meta] = m;

		// 	for (const mr of m) {
		// 		const ref = mr.ref;
		// 		if (!ref) return;
		// 		if (ref in references) return;
		// 		references[ref] = await fetchFunc(`/api/reference/${ref}`);
		// 	}
		// }

		// console.log('meta_references fetched', meta_references);
		// console.log('references fetched', references);
	};

	console.log('fetching data');
	const data = await fetch_data();
	// console.log('data fetched', data);

	if (data.species?.detail === 'Not found.') {
		error(404, `species of id=${params.id} not found`);
	}

	if (_.isEmpty(data.meta)) {
		error(404, `species of id=${params.id} metadata not found`);
	}

	return data;
};

export const actions: Actions = {
	delete_species: async ({ fetch, params }) => {
		const res = await fetch(
			`${DB_URL}/data/species/${params.id}/?delete_reason=${encodeURIComponent('testing')}`,
			{
				method: 'DELETE'
			}
		);

		const message = await res.text();
		console.log('delete_species', res.status, res.ok, res.statusText, message);
		if (!res.ok) return { status: res.status };

		redirect(303, '/species');
	}
};
