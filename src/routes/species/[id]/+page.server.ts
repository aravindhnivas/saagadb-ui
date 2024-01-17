import type { Actions, PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const fetchFunc = async <T>(url: string): Promise<T | null> => {
		const res = await fetch(url);
		if (!res.ok) return null;
		return res.json();
	};

	const queryString = new URLSearchParams({ species_id: params.id }).toString();
	// console.log({ queryString });
	const [species, meta] = await Promise.all([
		fetchFunc(`/api/species/${params.id}`),
		fetchFunc(`/api/species-metadata/query?query=${encodeURIComponent(queryString)}`)
	]);

	return { species, meta };
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
