import { fail, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const get_cdms_url = (tag: string) => {
	return `https://cdms.astro.uni-koeln.de/cgi-bin/cdmsinfo?file=e${tag}.cat`;
};

export const GET: RequestHandler = async ({ fetch, params }) => {
	const fetch_url = get_cdms_url(params.tag.padStart(6, '0'));
	console.log(fetch_url);

	const res = await fetch(fetch_url);

	if (!res.ok) {
		return fail(res.status, res.statusText);
	}
	const data = await res.text();
	if (data.includes('Something went through the roof!'))
		return text('Something went through the roof!', { status: 404 });
	return text(data, { status: 200 });
};
