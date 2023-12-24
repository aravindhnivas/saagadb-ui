import { redirect, type Handle, type HandleFetch, type RequestEvent } from '@sveltejs/kit';
import { tokenStore } from '$lib/server/stores';
import { get } from 'svelte/store';
import { env } from '$env/dynamic/private';

function getCookieValue(cookieName: string, cookieString: string): string | null {
	const cookies = cookieString?.split('; ') || [];
	const cookieValue = cookies.find((cookie) => cookie.startsWith(cookieName + '='));
	return cookieValue ? cookieValue.split('=')[1] : null;
}

export const handle: Handle = async ({ event, resolve }) => {
	const token = get(tokenStore);
	const header_cookie = event.request.headers.get('cookie') || '';
	const myCookieValue = getCookieValue('myCookie', header_cookie);
	console.log('myCookieValue', myCookieValue);

	console.log('handle', header_cookie, event.request.headers.getSetCookie());
	if (token) event.locals.token = token;

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

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (event.url.pathname.startsWith('/admin')) {
		if (!event.locals.token) {
			const fromUrl = event.url.pathname + event.url.search;
			const message = 'You must be logged in to access this page.';
			redirect(303, `/login?redirectTo=${fromUrl}&message=${message}`);
		}
	}

	console.log('handleFetch', request.url);
	if (request.url.startsWith(`http://${env.DOMAIN}/`)) {
		// clone the original request, but change the URL
		request = new Request(
			request.url.replace(`http://${env.DOMAIN}/`, `http://127.0.0.1:${env.PORT}/`),
			request
		);
	}

	const cookie = event.request.headers.get('cookie') || ''; // Provide a default value if cookie is null
	console.log({ cookie });
	request.headers.set('cookie', cookie);

	request.headers.set('Access-Control-Allow-Origin', `http://${env.DOMAIN}/`);
	request.headers.set('accept', 'application/json');
	request.headers.set('content-type', 'application/json');

	if (get(tokenStore)) {
		request.headers.set('Authorization', `Token ${get(tokenStore)}`);
	}

	return fetch(request);
};
