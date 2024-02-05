import { base } from '$app/paths';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const user_res = await fetch(`${base}/api/user/fetch/${params.id}`);
	const user = (await user_res.json()) as User;
	return { user };
};
