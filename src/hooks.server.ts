import { redirect, type Handle } from '@sveltejs/kit';
import { logged_in } from '$lib/utils';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	logged_in.set('');
	event.locals.domain = process.env.NODE_ENV === 'development' ? 'localhost' : env.DOMAIN;
	const token = event.cookies.get('token');
	console.log(`token: ${token}`);
	if (token) {
		event.locals.token = token;
		// logged_in.set(token);
	}

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.token) {
			const fromUrl = event.url.pathname + event.url.search;
			const message = 'You must be logged in to access this page.';
			redirect(303, `/login?redirectTo=${fromUrl}&message=${message}`);
		}
	}

	const response = await resolve(event);

	return response;
};
