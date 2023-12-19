import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const user = event.cookies.get('user');
	if (user) event.locals.user = JSON.parse(user);

	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.user?.token) {
			throw redirect(303, '/login');
		}
	}

	const response = await resolve(event);

	return response;
};
