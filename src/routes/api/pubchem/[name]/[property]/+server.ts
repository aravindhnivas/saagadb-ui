import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

interface PubchemProperty {
	PropertyTable: {
		Properties: { [name: string]: string }[];
	};
	Fault?: {
		Code: 'PUGREST.NotFound';
		Message: 'No CID found';
		Details: ['No CID found that matches the given name'];
	};
}

export const GET: RequestHandler = async ({ fetch, params }) => {
	const base_url_pubchem = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name';
	const fetch_url = `${base_url_pubchem}/${encodeURIComponent(params.name)}/property/${params.property}/JSON`;

	const res = await fetch(fetch_url);
	if (!res.ok) return json({ message: 'Failed to fetch data from PubChem' }, { status: 404 });

	const data = (await res.json()) as PubchemProperty;
	if (data?.Fault) return json({ message: data.Fault.Message }, { status: 404 });

	return json(data.PropertyTable.Properties, {
		status: 200,
		headers: {
			'Cache-Control': 'max-age=3600'
		}
	});
};
