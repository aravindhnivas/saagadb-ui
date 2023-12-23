import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const POST: RequestHandler = async ({ cookies, locals }) => {
	console.log(process.env.NODE_ENV);
	cookies.set('token', '', {
		maxAge: 0,
		path: '/',
		domain: locals.domain,
		httpOnly: true,
		sameSite: 'strict',
		secure: false
	});
	redirect(303, '/');
};
