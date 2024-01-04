// place files you want to import through the `$lib` alias in this folder.
import { env } from '$env/dynamic/private';

export const DB_URL = `${env.DB_PROTOCOL ?? 'http'}://${env.DB_HOST ?? '127.0.0.1'}:${
	env.DB_PORT ?? '8000'
}/api` as const;
