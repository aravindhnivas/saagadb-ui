import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals?.user) {
		error(500, { message: 'User not found', title: 'Internal Server Error' });
	}
	if (!locals.user.is_staff) {
		error(403, { message: 'Requires admin access', title: 'Forbidden' });
	}
};
