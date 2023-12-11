import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async ({ url, fetch }) => {
	const min = Number(url.searchParams.get('min_freq') ?? '0');
	const max = Number(url.searchParams.get('max_freq') ?? '1');
	const getLinequery = async () => {
		const res = await fetch(`/api/line/query?query=min_freq=${min}%26max_freq=${max}`);
		const data = await res.json();
		return data;
	};
	return { lines: getLinequery() };
};
