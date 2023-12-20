import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ cookies }) => {
	cookies.set('user', '', {
		maxAge: 0,
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true
	});
	redirect(303, '/');
};
