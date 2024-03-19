import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DB_ORIGIN } from '$lib/server';
import { base } from '$app/paths';

export const GET: RequestHandler = async ({ url, fetch, params }) => {
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

	if (params.name === 'species-metadata') {
		const new_data = data.map((d: SpeciesMetadata) => {
			let new_d = {};
			Object.keys(d).forEach((i) => {
				let val = d[i];
				if (i.endsWith('_file') && val) {
					// val = val.split('/').pop();
					const filename = val.split('/').pop();
					val = `${base}/uploads/sp/${filename}`;
				}
				new_d = {
					...new_d,
					[i]: val
				};
			});
			return new_d;
		});
		// console.log(new_data);
		return json(new_data, {
			status: 200
		});
	}

	return json(data, {
		status: 200
	});
};
