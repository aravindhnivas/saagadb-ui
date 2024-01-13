import { ids } from '$lib/utils/schemas/meta';

export const metadata_items: {
	value: (typeof ids)[number];
	name: string;
}[] = [
	{ value: 'species-metadata', name: 'Species metadata' },
	{ value: 'reference', name: 'Reference' },
	{ value: 'meta-reference', name: 'Meta reference' },
	{ value: 'line', name: 'Line' }
];
