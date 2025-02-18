import { base } from '$app/paths';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';

const parse_failed_response = async (res: Response) => {
	const content_type = res.headers.get('content-type');
	if (content_type && content_type.includes('application/json')) {
		const text = (await res.json()) as {
			code?: string;
			message?: string;
			error?: {
				type: string;
				message: string;
			};
			non_field_errors?: string[];
		};
		// console.log({ text });
		if (text.non_field_errors) return { success: false, message: text.non_field_errors[0] };
		return { success: false, message: text.error?.message || text.message };
	}
	let text = await res.text();
	console.log({ text: text.slice(0, 100) + '...' });
	const txtlines = text.split('\n');
	text = txtlines[0] + '\n' + txtlines[1];
	console.log({ text });
	return { success: false, message: text };
};

export const load: PageServerLoad = async ({ fetch, params, depends, locals }) => {
	if (!locals.user.is_staff || !locals.user.is_superuser) {
		error(403, {
			title: 'Forbidden',
			message: 'You do not have permission to access this page'
		});
	}
	const user_res = await fetch(`${base}/api/user/fetch/${params.id}`);
	if (!user_res.ok) {
		error(400, {
			title: 'User not found',
			message: 'User not found'
		});
	}

	const user = (await user_res.json()) as User;

	if (!user.approver?.includes(locals.user.id)) {
		error(403, {
			title: 'You are not the approver for this user',
			message: 'You do not have permission to approve data for this user.'
		});
	}

	// console.log(user.approver, { parent_user, user });

	const fetch_ref_and_species = async () => {
		depends('fetch:pending_approval');

		const res = await fetch(
			`${base}/api/data/meta-ref-and-species?uploaded_by=${user.id}&approved=false`
		);

		if (!res.ok) return { MetaReference: [], SpeciesMetadata: [] };

		const { MetaReference: ref, SpeciesMetadata: species_meta } = (await res.json()) as {
			MetaReference: MetaReference[];
			SpeciesMetadata: SpeciesMetadata[];
		};
		return {
			MetaReference: ref,
			SpeciesMetadata: species_meta.filter((f) => f.cat_file_added)
		};
	};

	return { user, fetch_ref_and_species: fetch_ref_and_species() };
};

export const actions: Actions = {
	async approve({ fetch, url, request }) {
		const formData = await request.formData();
		formData.append('approved', 'true');

		const id = url.searchParams.get('id') as string;
		const api_key = url.searchParams.get('api_key') as string;
		const post_url = `${DB_URL}/data/${api_key}/${id}/`;

		// console.log('formData', Object.fromEntries(formData.entries()));

		// return {
		// 	success: false,
		// 	message: 'test message'
		// };

		const formBody = new FormData();

		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				if (!(value.name && value.size)) formBody.append(key, '');
			}
			formBody.append(key, value);
		}

		// console.log('formBody', Object.fromEntries(formBody.entries()));

		// return {
		// 	success: false,
		// 	message: 'test message'
		// };

		const res = await fetch(post_url, {
			method: 'PATCH',
			body: formData
		});

		console.log(res.ok, res.status, res.statusText);
		if (!res.ok) return parse_failed_response(res);
		return {
			success: res.ok,
			message: 'Data approved successfully'
		};
	},

	async reject({ fetch, url, request }) {
		const formData = await request.formData();

		const delete_reason = formData.get('delete_reason') as string;
		const id = url.searchParams.get('id') as string;
		const api_key = url.searchParams.get('api_key') as string;
		const post_url = `${DB_URL}/data/${api_key}/${id}`;

		console.log({ post_url, delete_reason });

		const res = await fetch(`${post_url}/?delete_reason=${encodeURIComponent(delete_reason)}`, {
			method: 'DELETE'
		});

		console.log(res.ok, res.status, res.statusText);
		if (!res.ok) return parse_failed_response(res);

		return {
			success: res.ok,
			message: 'Data DELETED successfully'
		};
	}
};
