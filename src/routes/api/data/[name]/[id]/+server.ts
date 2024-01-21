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
