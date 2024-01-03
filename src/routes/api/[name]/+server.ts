import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_URL } from '$lib/server';

export const GET: RequestHandler = async ({ params, url }) => {
	const query = url.searchParams.get('query') ?? '';
	const fetch_url = `${DB_URL}/data/${params.name}${query ? `?${query}` : ''}`;

	const res = await fetch(fetch_url);

	const data = await res.json();
	if (data.error) error(500, data.error);

	return json(data, { status: 200 });
};

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json();
	// const auth = request.headers.get('Authorization');
	console.warn({
		name: params.name
	});
	const res = await fetch(`${DB_URL}/data/${params.name}/`, {
		method: 'POST',
		body: JSON.stringify(body)
	});

	console.log('returned post request from database', {
		ok: res.ok,
		status: res.status,
		statusText: res.statusText
	});

	if (!res.ok) error(res.status, { message: res.statusText });

	const data = await res.json();
	if (data.error) error(500, data.error);

	return json(data, { status: 201 });
};
