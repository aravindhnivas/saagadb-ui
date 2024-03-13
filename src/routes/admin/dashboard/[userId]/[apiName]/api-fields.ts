export const api_fields = {
	species: [
		{ name: 'approved', label: 'Approved' },
		{ name: 'name', label: 'Name', search_field: true },
		{ name: 'iupac_name', label: 'IUPAC', search_field: true },
		{ name: 'name_formula', label: 'Molecular formula', search_field: true },
		{ name: 'name_html', label: 'Name HTML' }
	],
	'species-metadata': [
		{ name: 'approved', label: 'Approved' },
		{ name: 'molecule_tag', label: 'Molecule tag', search_field: true },
		{ name: 'linelist_name', label: 'Linelist', search_field: true },
		{ name: 'category', label: 'Category', search_field: true },
		{ name: 'degree_of_freedom', label: 'Degree of Freedom' },
		{ name: 'hyperfine', label: 'Hyperfine' },
		{ name: 'mu_a', label: 'μ<sub>a</sub> / D' },
		{ name: 'mu_b', label: 'μ<sub>b</sub> / D' },
		{ name: 'mu_c', label: 'μ<sub>c</sub> / D' },
		{ name: 'a_const', label: 'A / MHz' },
		{ name: 'b_const', label: 'B / MHz' },
		{ name: 'c_const', label: 'C / MHz' }
	],
	reference: [
		{ name: 'approved', label: 'Approved' },
		{ name: 'doi', label: 'DOI', search_field: true },
		{ name: 'ref_url', label: 'Reference URL' }
	],
	'meta-reference': [
		{ name: 'approved', label: 'Approved' },
		{ name: 'doi', label: 'DOI', search_field: true },
		{ name: 'ref_url', label: 'Reference URL' },
		{ name: 'dipole_moment', label: 'Dipole Moment' },
		{ name: 'spectrum', label: 'Spectrum' }
	]
} as {
	[name: string]: { name: string; label: string; search_field?: boolean }[];
};
