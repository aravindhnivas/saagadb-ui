import { redirect } from '@sveltejs/kit';
import { logged_in } from '$lib/utils/stores';
import type { RequestHandler } from './$types';
import { delete_token } from '$lib/server/cookies';
export const POST: RequestHandler = async ({ cookies }) => {
	logged_in.set('');
	delete_token({ cookies });
	redirect(303, '/');
};
