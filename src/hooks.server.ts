import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token') || '';
	if (token) event.locals.token = token;
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.token) {
			const fromUrl = event.url.pathname + event.url.search;
			const message = 'You must be logged in to access the privileged admin page.';
			redirect(303, `/login?redirectTo=${fromUrl}&message=${message}`);
		}
	}

	const response = await resolve(event);

	return response;
};

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (request.url.startsWith(`http://${env.DOMAIN}/`)) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace(`http://${env.DOMAIN}/`, `http://127.0.0.1:${env.PORT}/`),
			request
		);
	}

	const cookie = event.request.headers.get('cookie') || ''; // Provide a default value if cookie is null
	// console.log({ cookie });
	request.headers.set('cookie', cookie);

	request.headers.set('Access-Control-Allow-Origin', `http://${env.DOMAIN}/`);
	request.headers.set('accept', 'application/json');
	request.headers.set('content-type', 'application/json');
	request.headers.set('Access-Control-Allow-Credentials', 'true');

	if (event.locals.token) {
		request.headers.set('Authorization', `Token ${event.locals.token}`);
	}

	return fetch(request);
};
