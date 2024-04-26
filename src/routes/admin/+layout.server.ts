import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		error(403, { title: 'Invalid user', message: 'Invalid User' });
	}
	return { user: locals.user };
};
