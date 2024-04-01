import { env } from '$env/dynamic/private';

export const DB_URL = `${env.DB_PROTOCOL ?? 'http'}://${env.DB_HOST ?? '127.0.0.1'}:${
	env.DB_PORT ?? '8000'
}/api` as const;

export const DB_ORIGIN = `${env.DB_PROTOCOL}://${env.DB_HOST}:${env.DB_PORT}` as const;

export const modify_backend_url = (
	data: never[] | Record<string, string>,
	url_base: string,
	criteria: (i: string, val: string) => boolean
) => {
	const fn = (d: Record<string, string>) => {
		let new_d: Record<string, string> = {};
		Object.keys(d).forEach((i) => {
			let val = d[i];
			if (criteria(i, val)) {
				const filename = val.split('/').pop();
				val = `${url_base}/${filename}`;
			}
			new_d = {
				...new_d,
				[i]: val
			};
		});
		return new_d;
	};

	if (Array.isArray(data)) {
		return data.map((d) => fn(d));
	} else {
		return fn(data);
	}
};
