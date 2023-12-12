import type { PageLoad } from './$types';
export const load: PageLoad = async ({ url, fetch }) => {
	const min = Number(url.searchParams.get('min_freq') ?? '0');
	const max = Number(url.searchParams.get('max_freq') ?? '1');
	const getLinequery = async () => {
		const query = encodeURIComponent(`min_freq${min}&max_freq=${max}`);
		const res = await fetch(`/api/line/query?query=${query}`);
		const data = await res.json();
		return data;
	};
	return { lines: getLinequery() };
};
