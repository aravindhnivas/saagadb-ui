import { fail, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const url_from_jpl_tag = (tag: string) => {
	const tag_num = tag.padStart(6, '0');
	return `https://spec.jpl.nasa.gov/ftp/pub/catalog/doc/d${tag_num}.cat`;
};

const url_from_cdms_tag = (tag: string) => {
	const tag_num = tag.padStart(6, '0');
	return `https://cdms.astro.uni-koeln.de/cgi-bin/cdmsinfo?file=e${tag_num}.cat`;
};

const URLs_by_tag = {
	cdms: url_from_cdms_tag,
	jpl: url_from_jpl_tag
};

export const GET: RequestHandler = async ({ fetch, params }) => {
	if (params.db !== 'cdms' && params.db !== 'jpl') return text('Invalid db', { status: 400 });
	if (!params.tag) return text('No tag provided', { status: 400 });

	const fetch_url = URLs_by_tag[params.db]?.(params.tag);
	console.log(fetch_url);

	const res = await fetch(fetch_url);

	if (!res.ok) {
		return fail(res.status, res.statusText);
	}
	const data = await res.text();
	if (data.includes('Something went through the roof!')) {
		return text('Something went through the roof!', { status: 404 });
	}

	return text(data, { status: 200 });
};
