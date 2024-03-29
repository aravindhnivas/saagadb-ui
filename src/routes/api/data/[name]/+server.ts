import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';

export const GET: RequestHandler = async ({ url, fetch }) => {
	const fetch_url = new URL(url.pathname, DB_ORIGIN);

	url.searchParams.forEach((value, key) => {
		fetch_url.searchParams.append(key, value);
	});

	const res = await fetch(fetch_url);

	if (!res.ok) {
		const { detail } = (await res.json()) as { detail: string };
		error(500, { message: `${res.statusText}: ${detail}` });
	}
	const data = await res.json();
	return json(data, { status: 200 });
};
