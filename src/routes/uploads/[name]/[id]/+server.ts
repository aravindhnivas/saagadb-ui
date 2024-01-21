import type { RequestHandler } from './$types';
import { error, text } from '@sveltejs/kit';
import { DB_ORIGIN } from '$lib/server';

const bib_url = `${DB_ORIGIN}/static/media/uploads`;
export const GET: RequestHandler = async ({ params }) => {
	const fetch_url = new URL(`${bib_url}/${params.name}/${params.id}`);
	const res = await fetch(fetch_url);
	if (!res.ok) return error(404, 'Requested file not found');
	const data = await res.text();
	return text(data, { status: 200 });
};
