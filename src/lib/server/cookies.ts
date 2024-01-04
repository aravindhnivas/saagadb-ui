import type { Cookies } from '@sveltejs/kit';

export const delete_token = ({ cookies }: { cookies: Cookies }) => {
	cookies.delete('token', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false
	});
};

export const set_token = ({ cookies, token }: { cookies: Cookies; token: string }) => {
	cookies.set('token', token, {
		path: '/',
		maxAge: 60 * 60 * 24,
		httpOnly: true,
		sameSite: 'lax',
		secure: false
	});
};
