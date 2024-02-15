import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';
import { delete_token } from '$lib/server/cookies';

export const GET: RequestHandler = async ({ url, locals, cookies, params, fetch }) => {
	if (!locals.token) {
		if (params.name !== 'verify-email') {
			error(401, { message: 'Unauthorized - login access needed' });
		}
	}
	const fetch_url = new URL(url.pathname, DB_ORIGIN);
	url.searchParams.forEach((value, key) => {
		fetch_url.searchParams.append(key, value);
	});

	const res = await fetch(fetch_url);

	// console.log(res.headers.get('content-type'));
	if (!res.ok) {
		if (params.name === 'me') delete_token({ cookies });
		const { detail } = (await res.json()) as { detail: string };
		return json({ error: `${res.statusText}: ${detail}` }, { status: 500 });
	}
	const data = await res.json();
	return json(data, { status: 200 });
};
