import { ids } from './schemas';

export const metadata_items: {
	value: (typeof ids)[number];
	name: string;
}[] = [
	{ value: 'species-metadata', name: 'Species metadata' },
	{ value: 'reference', name: 'Reference' },
	{ value: 'meta-reference', name: 'Meta reference' },
	{ value: 'line', name: 'Line' }
];
