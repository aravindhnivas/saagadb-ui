import { derived, writable } from 'svelte/store';

interface DoiCollection {
	index: number;
	query: string;
	doi: string;
	ref_url: string;
	bibtex: string;
	cite: string;
	dipole_moment: boolean;
	spectrum: boolean;
	notes: string;
	type?: 'success' | 'error';
	status?: string;
}

export const doi_collections = writable<DoiCollection[]>([]);
export const active_ind = writable<number>(-1);
export const active_obj = derived(
	[doi_collections, active_ind],
	([$doi_collections, $active_ind]) => {
		if ($active_ind < 0) return null;
		return $doi_collections[$active_ind];
	}
);

export const species_id = writable(0);
export const linelist_id = writable(0);
export const hyperfine = writable<boolean | 'indeterminate'>(false);
