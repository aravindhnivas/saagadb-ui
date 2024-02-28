import { sessionWritable } from '@macfja/svelte-persistent-store';

export const ref_doi = sessionWritable('ref_doi', '');
