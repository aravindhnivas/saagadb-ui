import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';

export const GET: RequestHandler = async ({ url }) => {
	const fetch_url = new URL(url.pathname, DB_ORIGIN);

	url.searchParams.forEach((value, key) => {
		fetch_url.searchParams.append(key, value);
	});

	const res = await fetch(fetch_url);

	if (!res.ok) {
		const text = await res.text();
		console.error(`Error in ${url.pathname}`, text);
		error(500, { message: `${res.statusText}: ${text}` });
	}
	const data = await res.json();
	return json(data, { status: 200 });
};

export const POST: RequestHandler = async ({ url, request }) => {
	const body = await request.json();
	const fetch_url = new URL(url.pathname, DB_ORIGIN);

	const res = await fetch(fetch_url, {
		method: 'POST',
		body: JSON.stringify(body)
	});

	const res_text = JSON.parse(await res.text());
	console.log('returned post request from database', {
		ok: res.ok,
		status: res.status,
		statusText: res.statusText,
		text: res_text
	});

	if (!res.ok) error(500, { message: `${res.statusText}: ${res_text}` });
	const data = await res.json();

	return json(data, { status: 201 });
};
