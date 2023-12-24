import { redirect, type Handle } from '@sveltejs/kit';
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
