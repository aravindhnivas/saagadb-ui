import type { PageLoad } from './$types';
import { base } from '$app/paths';
import { error } from '@sveltejs/kit';

const allowed_api = ['species', 'species-metadata', 'reference', 'meta-reference'];

export const load: PageLoad = async ({ fetch, params, parent }) => {
	const { userId, apiName } = params;

	if (Number.isNaN(parseInt(userId))) {
		error(400, {
			message: `'${userId}' is not a valid user id. Please provide a valid user id in the URL`,
			title: 'Invalid User ID'
		});
	}

	if (!allowed_api.includes(apiName)) {
		error(404, { message: `'${apiName}' is not a valid API name`, title: 'Invalid API' });
	}

	const parent_data = await parent();
	if (parent_data.user.id !== Number(userId)) {
		if (!parent_data.user.is_superuser) {
			error(403, {
				title: 'Unauthorized',
				message: 'You do not have permission to access this user data'
			});
		}
	}

	const res = await fetch(`${base}/api/data/${apiName}?uploaded_by=${userId}`);
	if (!res.ok) {
		const reason = await res.json();
		console.log({ reason });
		error(400, { message: 'Could not fetch the data', title: 'Internal Server Error' });
	}

	const data = await res.json();
	return { metadata: data };
};
