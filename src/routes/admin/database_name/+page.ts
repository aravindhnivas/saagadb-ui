import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const load = () => {
	redirect(303, base + '/admin/database_name/linelist/');
};
