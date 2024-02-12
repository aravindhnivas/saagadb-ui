import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const { user } = await parent();
	if (!user?.is_staff)
		error(403, { message: 'Requires staff/superuser permission to add linelist' });
};
