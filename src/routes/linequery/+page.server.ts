import type { PageServerLoad } from './$types';
import { DB_URL } from '$lib/utils';
export const load: PageServerLoad = async ({ url, fetch }) => {
	const min = Number(url.searchParams.get('min_freq') ?? '0');
	const max = Number(url.searchParams.get('max_freq') ?? '1');
	const getLinequery = async () => {
		const res = await fetch(`${DB_URL}/line/query?min_freq=${min}&max_freq=${max}`);
		return await res.json();
	};
	return { lines: getLinequery() };
};
