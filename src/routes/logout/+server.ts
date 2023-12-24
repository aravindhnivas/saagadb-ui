import { redirect } from '@sveltejs/kit';
import { logged_in } from '$lib/utils';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ cookies, locals }) => {
	logged_in.set('');
	cookies.delete('token', { path: '/', domain: locals.domain });
	redirect(303, '/');
};
