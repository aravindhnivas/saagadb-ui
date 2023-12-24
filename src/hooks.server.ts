import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { tokenStore } from '$lib/server/stores';
import { get } from 'svelte/store';

export const handle: Handle = async ({ event, resolve }) => {
	const token = get(tokenStore);
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
	// if (request.url.startsWith('/admin')) {
	// 	request.headers.set('cookie', event?.request.headers.get('cookie') ?? '');
	// }

	request.headers.set('accept', 'application/json');
	request.headers.set('content-type', 'application/json');
	if (get(tokenStore)) {
		request.headers.set('Authorization', `Token ${get(tokenStore)}`);
	}

	return fetch(request);
};
