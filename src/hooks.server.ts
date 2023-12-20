import { redirect, type Handle } from '@sveltejs/kit';
import { logged_in } from '$lib/utils';

export const handle: Handle = async ({ event, resolve }) => {
	console.log('hook server ran');
	const token = event.cookies.get('token');
	if (token) {
		event.locals.token = token;
		logged_in.set(token);
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
