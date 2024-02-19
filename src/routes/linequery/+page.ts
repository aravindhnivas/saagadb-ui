import { base } from '$app/paths';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load: PageLoad = async ({ url, fetch }) => {
	const getLinequery = async () => {
		const min_freq = url.searchParams.get('min_freq');
		const max_freq = url.searchParams.get('max_freq');
		if (min_freq === null || max_freq === null) return [];

		const queryString = new URLSearchParams({ min_freq, max_freq }).toString();
		console.log('queryString', queryString);
		const fetch_url_page = `${base}/api/data/line/query?${queryString}`;
		const res = await fetch(fetch_url_page);
		const data = await res.json();
		if (data.error) error(500, data.error);
		return data;
	};

	return { lines: getLinequery() };
};
