import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';
import { delete_token } from '$lib/server/cookies';

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	if (!locals.token) {
		return json({ error: 'Not logged in' }, { status: 401 });
	}

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
		// error(500, { message: `${res.statusText}: ${detail}` });
		return json({ error: `${res.statusText}: ${detail}` }, { status: 500 });
	}
	const data = await res.json();
	return json(data, { status: 200 });
};
