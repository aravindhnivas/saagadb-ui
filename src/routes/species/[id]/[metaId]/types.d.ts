interface Reference {
	id: string;
	doi: string;
	ref_url: string;
	bibtex: string;
	notes: string;
}

interface MetaReference {
	id: string;
	meta: string;
	ref: string;
	dipole_moment: boolean;
	spectrum: boolean;
	notes: string;
}
