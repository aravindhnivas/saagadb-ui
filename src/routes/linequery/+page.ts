import { base } from '$app/paths';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load: PageLoad = async ({ url, fetch }) => {
	const getLinequery = async () => {
		const min_freq = url.searchParams.get('min_freq') ?? '0';
		const max_freq = url.searchParams.get('max_freq') ?? '0';
		if (!min_freq || !max_freq) error(500, 'min_freq and max_freq must be specified');
		const queryString = new URLSearchParams({ min_freq, max_freq }).toString();
		const fetch_url_page = `${base}/api/data/line/query?${queryString}`;
		const res = await fetch(fetch_url_page);
		const data = await res.json();
		if (data.error) error(500, data.error);
		return data;
	};

	return { lines: getLinequery() };
};
