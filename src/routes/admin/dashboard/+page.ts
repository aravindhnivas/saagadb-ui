import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { user } = await parent();
	if (!user) return;

	// const linelist_uploaded_by_me = await fetch('/api/linelist?uploaded_by_me=true');
	// console.log(user);
};
