import { base } from '$app/paths';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';

export const load: PageServerLoad = async ({ fetch, params, depends }) => {
	const user_res = await fetch(`${base}/api/user/fetch/${params.id}`);
	if (!user_res.ok) {
		error(400, {
			title: 'User not found',
			message: 'User not found'
		});
	}

	const user = (await user_res.json()) as User;

	const fetch_ref_and_species = async () => {
		depends('fetch:pending_approval');

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
		formData.append('approved', 'true');

		// console.log(formData);
		// return {
		// 	success: false,
		// 	message: 'Test message'
		// };

		const id = url.searchParams.get('id') as string;
		const api_key = url.searchParams.get('api_key') as string;
		const post_url = `${DB_URL}/data/${api_key}/${id}/`;

		const res = await fetch(post_url, {
			method: 'PATCH',
			body: formData
		});

		console.log(res.ok, res.status, res.statusText);

		if (!res.ok) {
			const content_type = res.headers.get('content-type');
			if (content_type && content_type.includes('application/json')) {
				const text = await res.json();
				return { success: false, message: text };
			} else {
				const text = await res.text();
				return { success: false, message: text };
			}
		}

		return {
			success: res.ok,
			message: 'Data approved successfully'
		};
	},

	async reject({ fetch, url, request }) {
		const formData = await request.formData();

		// console.log(url.pathname);
		const delete_reason = formData.get('delete_reason') as string;
		const id = url.searchParams.get('id') as string;
		const api_key = url.searchParams.get('api_key') as string;
		const post_url = `${DB_URL}/data/${api_key}/${id}`;
		console.log({ post_url, delete_reason });
		// return {
		// 	success: false,
		// 	message: 'Test message'
		// };
		const res = await fetch(`${post_url}/?delete_reason=${encodeURIComponent(delete_reason)}`, {
			method: 'DELETE'
		});
		console.log(res.ok, res.status, res.statusText);

		if (!res.ok) {
			const content_type = res.headers.get('content-type');
			let text = '';
			if (content_type && content_type.includes('application/json')) {
				text = await res.json();
			} else {
				text = await res.text();
				console.log({ text: text.slice(0, 100) + '...' });
				const txtlines = text.split('\n');
				text = txtlines[0] + '\n' + txtlines[1];
			}
			return { success: false, message: text };
		}

		return {
			success: res.ok,
			message: 'Data DELETED successfully'
		};
	}
};
