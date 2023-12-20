import { redirect, type Handle } from '@sveltejs/kit';
import { logged_in } from '$lib/utils';

export const handle: Handle = async ({ event, resolve }) => {
	const user = event.cookies.get('user');
	if (user) {
		event.locals.user = JSON.parse(user);
		logged_in.set(event.locals.user?.email ?? '');
	}
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user?.token) {
			const fromUrl = event.url.pathname + event.url.search;
			const message = 'You must be logged in to access this page.';
			redirect(303, `/login?redirectTo=${fromUrl}&message=${message}`);
		}
	}

	const response = await resolve(event);

	return response;
};
