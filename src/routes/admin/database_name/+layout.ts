import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ locals }) => {
	if (!locals?.user.is_staff) {
		error(403, { message: 'Requires admin access', title: 'Forbidden' });
	}
};
