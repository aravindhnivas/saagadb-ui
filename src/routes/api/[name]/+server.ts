import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_URL } from '$lib/server';

export const GET: RequestHandler = async ({ params, url }) => {
	const query = url.searchParams.get('query') ?? '';
	const fetch_url = `${DB_URL}/data/${params.name}${query ? `?${query}` : ''}`;

	const res = await fetch(fetch_url);

	const data = await res.json();
	if (data.error) error(500, data.error);
	return new Response(JSON.stringify(data), { status: 200 });
};
