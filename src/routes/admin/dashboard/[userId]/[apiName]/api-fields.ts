export const api_fields = {
	species: [
		{ name: 'approved', label: 'Approved' },
		{ name: 'name', label: 'Name', search_field: true },
		{ name: 'iupac_name', label: 'IUPAC', search_field: true },
		{ name: 'name_formula', label: 'Molecular formula', search_field: true },
		{ name: 'name_html', label: 'Name HTML' },
		{ name: 'smiles', label: 'SMILES', search_field: true },
		{ name: 'standard_inchi', label: 'InChI', search_field: true },
		{ name: 'standard_inchi_key', label: 'InChIKey', search_field: true },
		{ name: 'notes', label: 'Notes' }
	],
	'species-metadata': [
		{ name: 'approved', label: 'Approved' },
		{ name: 'species_smiles', label: 'SMILES', search_field: true, editable: false },
		{ name: 'species_name', label: 'Species name', search_field: true, editable: false },
		{ name: 'cat_file', label: 'Cat file', editable: false, link: true, download: true },
		{ name: 'molecule_tag', label: 'Molecule tag', search_field: true, editable: false },
		{ name: 'linelist_name', label: 'Linelist', search_field: true, editable: false },
		{ name: 'category', label: 'Category', search_field: true },
		{ name: 'degree_of_freedom', label: 'Degree of Freedom' },
		{ name: 'hyperfine', label: 'Hyperfine' },
		{ name: 'mu_a', label: 'μ<sub>a</sub> / D' },
		{ name: 'mu_b', label: 'μ<sub>b</sub> / D' },
		{ name: 'mu_c', label: 'μ<sub>c</sub> / D' },
		{ name: 'a_const', label: 'A / MHz' },
		{ name: 'b_const', label: 'B / MHz' },
		{ name: 'c_const', label: 'C / MHz' },
		{ name: 'notes', label: 'Notes' }
	],
	reference: [
		{ name: 'approved', label: 'Approved' },
		{ name: 'doi', label: 'DOI', search_field: true },
		{ name: 'ref_url', label: 'Reference URL', link: true },
		{ name: 'notes', label: 'Notes' }
	],
	'meta-reference': [
		{ name: 'approved', label: 'Approved' },
		{ name: 'doi', label: 'DOI', search_field: true },
		{ name: 'ref_url', label: 'Reference URL', link: true },
		{ name: 'dipole_moment', label: 'Dipole Moment' },
		{ name: 'spectrum', label: 'Spectrum' },
		{ name: 'notes', label: 'Notes' }
	]
} as {
	[name: string]: {
		name: string;
		label: string;
		search_field?: boolean;
		editable?: boolean;
		link?: boolean;
		download?: boolean;
	}[];
};
