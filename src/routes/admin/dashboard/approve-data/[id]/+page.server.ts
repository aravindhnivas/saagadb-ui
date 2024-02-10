import { base } from '$app/paths';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const user_res = await fetch(`${base}/api/user/fetch/${params.id}`);
	const user = (await user_res.json()) as User;
	const fetch_ref_and_species = async () => {
		if (!user?.id) error(400, 'User ID not provided');
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
	return { user, fetch_ref_and_species: fetch_ref_and_species() };
};

export const actions: Actions = {
	async approve({ fetch, url, request }) {
		const formData = await request.formData();
		const species_name = formData.get('species_name');

		console.log(formData, { species_name });

		const id = url.searchParams.get('id') as string;
		const api_key = url.searchParams.get('api_key') as string;
		const post_url = `${DB_URL}/data/${api_key}/${id}/`;
		console.log({ id, api_key, post_url });

		return { success: false, message: 'Data approved successfully' };
		const res = await fetch(post_url, {
			method: 'PATCH',
			body: JSON.stringify({ approved: true }),
			headers: { 'Content-Type': 'application/json' }
		});
		console.log(res.ok);

		if (!res.ok) {
			const text = await res.json();
			return { success: false, message: text };
		}

		return {
			success: res.ok,
			message: 'Data approved successfully'
		};
	}
};
