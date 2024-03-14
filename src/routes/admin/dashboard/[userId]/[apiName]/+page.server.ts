import type { Actions, PageServerLoad } from './$types';
import { base } from '$app/paths';
import { error } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const allowed_api = ['species', 'species-metadata', 'reference', 'meta-reference'];

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const { userId, apiName } = params;
	// console.log({ userId, apiName });
	if (Number.isNaN(parseInt(userId))) {
		error(400, {
			message: `'${userId}' is not a valid user id. Please provide a valid user id in the URL`,
			title: 'Invalid User ID'
		});
	}

	if (!allowed_api.includes(apiName)) {
		error(404, { message: `'${apiName}' is not a valid API name`, title: 'Invalid API' });
	}

	const { user: parent_user } = await parent();

	if (parent_user.id !== Number(userId)) {
		if (!parent_user.is_superuser) {
			error(403, {
				title: 'Unauthorized',
				message: 'You do not have permission to edit data of other users'
			});
		}
	}

	if (!(parent_user.is_staff || parent_user.is_superuser)) {
		error(403, {
			title: 'Unauthorized',
			message: 'You do not have permission to edit data.'
		});
	}

	const fetch_stuff = async <T>(url: string) => {
		const res = await fetch(url);
		if (!res.ok) {
			const reason = await res.json();
			console.log({ reason });
			error(400, { message: 'Could not fetch the data', title: 'Internal Server Error' });
		}
		const data = (await res.json()) as T;
		return data;
	};
	type Metadata = { [name: string]: string }[];
	const metadata = await fetch_stuff<Metadata>(`${base}/api/data/${apiName}?uploaded_by=${userId}`);
	return { metadata };
};

export const actions: Actions = {
	async update_metadata({ fetch, params, url, request }) {
		const formData = await request.formData();

		const id = url.searchParams.get('id') as string;
		const body = Object.fromEntries(formData.entries());

		if (params.apiName === 'species') {
			body['name'] = body['name'].split(',').map((name: string) => name.trim());
		}

		// console.log({ id, body });

		// return {
		// 	success: false,
		// 	message: 'test message'
		// };

		const res = await fetch(`${DB_URL}/data/${params.apiName}/${id}/`, {
			method: 'PATCH',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' }
		});

		// console.log(res.ok, res.status, res.statusText);

		if (!res.ok) {
			const reason = await res.text();
			console.log({ reason });
			return {
				success: false,
				message: reason
			};
		}

		const data = await res.json();
		// console.log({ data });
		return {
			posted: data,
			success: true,
			message: `Metadata (id=${data?.id}) updated successfully`
		};
	}
};
