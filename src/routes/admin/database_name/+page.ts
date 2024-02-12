import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	redirect(303, base + '/admin/database_name/linelist/');
};
