import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { text } from '@sveltejs/kit';

const bib_url = `${env.DB_PROTOCOL}://${env.DB_HOST}:${env.DB_PORT}/static/media/uploads`;

export const GET: RequestHandler = async ({ params }) => {
	const fetch_url = new URL(`${bib_url}/${params.name}/${params.id}`);
	const res = await fetch(fetch_url);
	const data = await res.text();
	return text(data, { status: 200 });
};
