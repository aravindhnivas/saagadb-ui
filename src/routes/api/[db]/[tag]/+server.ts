import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { url_from_cdms_tag, url_from_jpl_tag } from '$lib/core';

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
		return text('Something went wrong', { status: 404 });
	}
	const html_data = await res.text();
	if (html_data.includes('Something went through the roof!')) {
		return text('Something went through the roof!', { status: 404 });
	}
	const source_url = params.db === 'cdms' ? fetch_url : fetch_url.replace('.cat', '.pdf');
	return json({ html_data, source_url }, { status: 200 });
};
