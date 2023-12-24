import { redirect } from '@sveltejs/kit';
import { logged_in } from '$lib/utils';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ cookies, locals }) => {
	logged_in.set('');
	cookies.set('token', '', {
		maxAge: 0,
		path: '/',
		domain: locals.domain,
		httpOnly: true,
		sameSite: 'lax'
		// secure: false
	});
	redirect(303, '/');
};
