import type { Cookies } from '@sveltejs/kit';

export const delete_token = ({ cookies, name = 'token' }: { cookies: Cookies; name?: string }) => {
	cookies.delete(name, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false
	});
};

export const set_token = ({
	cookies,
	token,
	name = 'token',
	maxAge = 60 * 60 * 24
}: {
	cookies: Cookies;
	token: string;
	name?: string;
	maxAge?: number;
}) => {
	cookies.set(name, token, {
		path: '/',
		maxAge,
		httpOnly: true,
		sameSite: 'lax',
		secure: false
	});
};

export const set_JWT = ({
	cookies,
	JWT
}: {
	cookies: Cookies;
	JWT: {
		access: string;
		refresh: string;
	};
}) => {
	set_token({ cookies, token: JWT.access, name: 'JWT-access', maxAge: 60 * 4 });
	set_token({
		cookies: cookies,
		token: JWT.refresh,
		name: 'JWT-refresh',
		maxAge: 60 * 60 * 24 * 30
	});
};
