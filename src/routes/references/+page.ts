import type { PageLoad } from './$types';
import { base } from '$app/paths';
import type { Reference } from '$lib/schemas/reference';

export const load: PageLoad = async ({ fetch }) => {
	const fetch_refs = async () => {
		const res = await fetch(`${base}/api/data/reference`);
		if (!res.ok) return [];
		const ref = (await res.json()) as Reference[];
		return ref;
	};
	return { load: fetch_refs() };
};
