import { error, json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';
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

	if (params.name === 'species-metadata' || params.name === 'reference') {
		let new_data = {};
		Object.keys(data).forEach((i) => {
			let val = data[i];
			if ((i.endsWith('_file') && val) || i === 'bibtex') {
				const filename = val.split('/').pop();
				val = `${base}/uploads/sp/${filename}`;
			}
			new_data = {
				...new_data,
				[i]: val
			};
		});

		return json(new_data, {
			status: 200
		});
	}

	return json(data, { status: 200 });
};
