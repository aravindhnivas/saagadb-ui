import { redirect, type Handle } from '@sveltejs/kit';
import { tokenStore } from '$lib/utils';
import { env } from '$env/dynamic/private';
import { get } from 'svelte/store';

export const handle: Handle = async ({ event, resolve }) => {
	// console.log({ cookies: get(cookies).token });
	event.locals.domain = process.env.NODE_ENV === 'development' ? 'localhost' : env.DOMAIN;
	// const token = event.cookies.get('token');
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
