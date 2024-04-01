import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN, modify_backend_url } from '$lib/server';
import { base } from '$app/paths';

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

	let new_data;
	switch (params.name) {
		case 'species-metadata':
			new_data = modify_backend_url(data, `${base}/uploads/sp`, (k, v) =>
				Boolean(k.endsWith('_file') && v)
			);
			break;

		case 'reference':
			new_data = modify_backend_url(data, `${base}/uploads/bib`, (k) => k === 'bibtex');
			break;

		case 'misc-files-upload':
			new_data = modify_backend_url(data, `${base}/uploads/sp`, (k) => k === 'misc_file');
			break;

		default:
			break;
	}

	if (new_data) {
		return json(new_data, { status: 200 });
	}

	return json(data, { status: 200 });
};
