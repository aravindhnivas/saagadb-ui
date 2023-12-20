import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	return {
		email: event.locals.user?.email ?? ''
	};
};
