import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';

export const GET: RequestHandler = async ({ url, params, fetch }) => {
	const fetch_url = new URL(url.pathname, DB_ORIGIN);

	url.searchParams.forEach((value, key) => {
		fetch_url.searchParams.append(key, value);
	});

	const res = await fetch(fetch_url);

	if (!res.ok) {
		const { detail } = (await res.json()) as { detail: string };
		error(500, { message: `${res.statusText}: ${detail}` });
	}

	if (params.name === 'reference' && params.id === 'bibtex') {
		const data = await res.text();
		return text(data, { status: 200 });
	}

	const data = await res.json();
	return json(data, { status: 200 });
};
