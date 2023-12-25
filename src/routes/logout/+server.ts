import { redirect } from '@sveltejs/kit';
import { logged_in } from '$lib/utils/stores';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ locals, cookies }) => {
	logged_in.set('');
	cookies.delete('token', {
		path: '/', 
		domain: locals.domain, 
		httpOnly: true,
		sameSite: "lax",
		secure: false 
	});
	redirect(303, '/');
};
