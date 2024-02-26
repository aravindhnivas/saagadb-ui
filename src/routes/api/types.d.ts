interface Species {
	id: number;
	name: string;
	iupac_name: string;
	name_formula: string;
	name_html: string;
	molecular_mass: string;
	smiles: string;
	standard_inchi: string;
	standard_inchi_key: string;
	selfies: string;
	notes: string;
	message?: string;
	approved: boolean;
	uploaded_by: number;
}

interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	organization: string;
	is_staff: boolean;
	is_active: boolean;
	is_superuser: boolean;
	is_verified: boolean;
	approver: boolean;
	approver_name: string[];
}

interface Linelist {
	id: number;
	linelist_name: string;
	approved: boolean;
	uploaded_by: number;
}
interface SpeciesMetadata {
	id: number;
	species: number;
	molecule_tag: number;
	hyperfine: boolean;
	degree_of_freedom: number;
	category: string;
	partition_function: {
		[name: string]: number;
	};
	mu_a: string;
	mu_b: string;
	mu_c: string;
	a_const: string;
	b_const: string;
	c_const: string;
	linelist: number;
	data_date: string;
	data_contributor: string;
	qpart_file: string;
	int_file: string;
	var_file: string;
	fit_file: string;
	lin_file: string;
	cat_file: string;
	notes: string;
	approved: boolean;
	uploaded_by: number;
	species_formula: string;
	species_name: string;
	linelist_name: string;
	uploaded_by_name: string;
}

interface Reference {
	id: string;
	doi: string;
	ref_url: string;
	bibtex: string;
	notes: string;
	uploaded_by: string;
	approved: boolean;
}

interface MetaReference {
	id: string;
	meta: string;
	ref: string;
	dipole_moment: boolean;
	spectrum: boolean;
	notes: string;
	uploaded_by: string;
	approved: boolean;
	species_formula: string;
	species_name: string;
	linelist_name: string;
	doi: string;
	ref_url: string;
	uploaded_by_name: string;
}
