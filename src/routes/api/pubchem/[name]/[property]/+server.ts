import { fail, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface PubchemProperty {
	PropertyTable: {
		Properties: { [name: string]: string }[];
	};
}

interface PubchemPropertyFail {
	Fault: {
		Code: 'PUGREST.NotFound';
		Message: 'No CID found';
		Details: ['No CID found that matches the given name'];
	};
}

export const GET: RequestHandler = async ({ fetch, params }) => {
	const base_url_pubchem = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name';
	const fetch_url = `${base_url_pubchem}/${encodeURIComponent(params.name)}/property/${params.property}/JSON`;
	console.log(fetch_url);

	const res = await fetch(fetch_url);
	if (!res.ok) return fail(res.status, res.statusText);

	const data = (await res.json()) as PubchemProperty;
	if (data?.Fault) return fail(404, data.Fault.Message);

	// if (data) console.log(JSON.stringify(data, null, 2));
	return json(data.PropertyTable.Properties, { status: 200 });
};
