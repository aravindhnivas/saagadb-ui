import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';
import { delete_token } from '$lib/server/cookies';

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	if (!locals.token) error(401, { message: 'Unauthorized' });

	const fetch_url = new URL(url.pathname, DB_ORIGIN);

	url.searchParams.forEach((value, key) => {
		fetch_url.searchParams.append(key, value);
	});

	const res = await fetch(fetch_url, {
		headers: { Authorization: `Token ${locals.token}` }
	});

	if (!res.ok) {
		delete_token({ cookies });
		const { detail } = (await res.json()) as { detail: string };
		error(500, { message: `${res.statusText}: ${detail}` });
	}
	const data = await res.json();
	return json(data, { status: 200 });
};
