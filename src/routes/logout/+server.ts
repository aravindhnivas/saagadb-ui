import { redirect } from '@sveltejs/kit';
import { logged_in, tokenStore } from '$lib/utils';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ locals }) => {
	logged_in.set('');
	tokenStore.set('');
	// cookies.delete('token', { path: '/', domain: locals.domain });
	redirect(303, '/');
};
