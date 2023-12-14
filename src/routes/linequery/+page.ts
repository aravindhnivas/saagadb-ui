import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
export const load: PageLoad = async ({ url, fetch }) => {
	const getLinequery = async () => {
		const min_freq = Number(url.searchParams.get('min_freq'));
		const max_freq = Number(url.searchParams.get('max_freq'));
		const query = encodeURIComponent(`min_freq=${min_freq}&max_freq=${max_freq}`);
		const res = await fetch(`/api/line/query?query=${query}`);
		const data = await res.json();
		if (data.error) throw error(500, data.error);
		return data;
	};

	return { streamed: { lines: getLinequery() } };
};
