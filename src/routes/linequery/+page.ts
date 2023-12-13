import type { PageLoad } from './$types';
export const load: PageLoad = async ({ url, fetch }) => {
	// console.log(url);
	const getLinequery = async () => {
		const min_freq = Number(url.searchParams.get('min_freq'));
		const max_freq = Number(url.searchParams.get('max_freq'));
		const query = encodeURIComponent(`min_freq=${min_freq}&max_freq=${max_freq}`);
		const res = await fetch(`/api/line/query?query=${query}`);
		const data = await res.json();
		return data;
	};
	return { lines: getLinequery() };

	// return { lines: [] };
};
