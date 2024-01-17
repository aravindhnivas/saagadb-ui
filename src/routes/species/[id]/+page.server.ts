import type { Actions, PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const fetchFunc = async <T>(
		url: string,
		queryID?: { [name: string]: string }
	): Promise<T | null> => {
		if (queryID) {
			const queryString = new URLSearchParams(queryID).toString();
			url += `/query?query=${encodeURIComponent(queryString)}`;
		}
		const res = await fetch(url);
		if (!res.ok) return null;
		return res.json();
	};

	const fetch_data = async () => {
		// const queryString = new URLSearchParams({ species_id: params.id }).toString();
		// console.log({ queryString });
		const [species, meta] = await Promise.all([
			fetchFunc(`/api/species/${params.id}`),
			fetchFunc(`/api/species-metadata`, { species_id: params.id })
		]);

		const meta_references: { [name: string]: [] } = {};

		const meta_ref_fetched = await Promise.all(
			meta?.map(({ id: meta_id }) => fetchFunc(`/api/meta-reference`, { meta_id }))
		);

		const references: { [name: string]: [] } = {};

		for (const m of meta_ref_fetched) {
			if (!m) return;
			if (!m[0]) return;
			meta_references[m[0].meta] = m;

			for (const mr of m) {
				const ref = mr.ref;
				if (!ref) return;
				if (ref in references) return;
				references[ref] = await fetchFunc(`/api/reference/${ref}`);
			}
		}

		// for (const m of meta_ref_fetched) {
		// 	meta_references[m[0].meta] = { meta: m, ref: [] };
		// 	meta_references[m[0].meta].ref = await Promise.all(
		// 		m.map((mr) => fetchFunc(`/api/reference/${mr.ref}`))
		// 	);
		// }

		return { species, meta, meta_references, references };
	};

	return fetch_data();
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
