import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_URL } from '$lib/server';
export const GET: RequestHandler = async ({ params, url, locals }) => {
	const query = url.searchParams.get('query') ?? '';
	const fetch_url = `${DB_URL}/data/${params.name}/${params.id}/${query ? `?${query}` : ''}`;
	const headers = {
		accept: 'application/json',
		Authorization: locals.token ? `Token ${locals.token}` : ''
	};

	const res = await fetch(fetch_url, {
		method: 'GET',
		headers
	});

	const data = await res.json();
	if (data.error) error(500, data.error);
	return new Response(JSON.stringify(data), { status: 200 });
};
