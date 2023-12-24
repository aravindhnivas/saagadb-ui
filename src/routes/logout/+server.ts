import { redirect } from '@sveltejs/kit';
import { tokenStore } from '$lib/server/stores';
import { logged_in } from '$lib/utils/stores';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ locals }) => {
	logged_in.set('');
	tokenStore.set('');
	redirect(303, '/');
};
