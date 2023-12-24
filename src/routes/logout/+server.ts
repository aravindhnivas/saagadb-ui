import { redirect } from '@sveltejs/kit';
import { tokenStore } from '$lib/server/stores';
import { logged_in } from '$lib/utils/stores';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ locals, cookies }) => {
	logged_in.set('');
	tokenStore.set('');
	cookies.delete('token', { path: '/', domain: locals.domain });
	redirect(303, '/');
};
