import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_URL } from '$lib/server';
export const GET: RequestHandler = async ({ params, url }) => {
	const fetch_url = new URL(`${DB_URL}/data/${params.name}/${params.id}`);
	url.searchParams.forEach((value, key) => {
		fetch_url.searchParams.append(key, value);
	});
	// console.log(fetch_url);
	const res = await fetch(fetch_url);

	const data = await res.json();
	if (data.error) error(500, data.error);
	return new Response(JSON.stringify(data), { status: 200 });
};
