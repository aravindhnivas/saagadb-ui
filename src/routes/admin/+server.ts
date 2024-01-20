import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export const GET = () => {
	redirect(303, base + '/admin/dashboard');
};
