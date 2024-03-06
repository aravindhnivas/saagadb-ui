import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ parent }) => {
	const parent_data = await parent();
	if (!parent_data.user.is_staff) {
		error(403, { message: 'Requires admin access', title: 'Forbidden' });
	}
};
