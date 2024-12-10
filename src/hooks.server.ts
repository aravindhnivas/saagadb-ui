import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { DB_URL } from '$lib/server';
import { delete_token, set_JWT } from '$lib/server/cookies';
import { jwtDecode } from 'jwt-decode';
import { base } from '$app/paths';
import { logged_in } from '$lib/utils/stores';

export const handle: Handle = async ({ event, resolve }) => {
	const access_token = event.cookies.get('JWT-access') || '';
	const refresh_token = event.cookies.get('JWT-refresh') || '';
	if (access_token && access_token !== 'undefined') event.locals.access_token = access_token;

	if (refresh_token && refresh_token !== 'undefined') {
		event.locals.refresh_token = refresh_token;

		if (!access_token || access_token === 'undefined') {
			const res = await fetch(`${DB_URL}/token/refresh/`, {
				method: 'POST',
				body: JSON.stringify({ refresh: event.locals.refresh_token }),
				headers: { 'Content-Type': 'application/json' }
			});
			const JWT = (await res.json()) as { access: string; refresh: string };
			set_JWT({ cookies: event.cookies, JWT });
			event.locals.access_token = JWT.access;
			event.locals.refresh_token = JWT.refresh;

			const decoded = jwtDecode(refresh_token) as TokenDecoded;
			event.locals.user = { ...decoded.user, approver_name: decoded.user_approvers };
			console.log('Renewing access token using refresh token');
			if (!event.locals.user) {
				console.warn('Invalid token found, logging out user...');
				logged_in.set('');
				delete_token({ cookies: event.cookies, name: 'JWT-access' });
				delete_token({ cookies: event.cookies, name: 'JWT-refresh' });
			}
		} else if (access_token && !event.locals.user) {
			const decoded = jwtDecode(refresh_token) as TokenDecoded;
			event.locals.user = { ...decoded.user, approver_name: decoded.user_approvers };
		}
	}

	if (event.url.pathname.startsWith(`${base}/admin`)) {
		if (!event.locals.refresh_token) {
			let fromUrl = event.url.pathname + event.url.search;
			fromUrl = fromUrl.replace(`${base}`, '');
			redirect(303, `${base}/login?redirectTo=${fromUrl}`);
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
	request.headers.set('cookie', cookie);
	request.headers.set('Access-Control-Allow-Origin', `http://${env.DOMAIN}/`);
	request.headers.set('accept', 'application/json');
	request.headers.set('Access-Control-Allow-Credentials', 'true');

	if (event.locals.access_token) {
		request.headers.set('Authorization', `Bearer ${event.locals.access_token}`);
	}

	return fetch(request);
};
