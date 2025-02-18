interface Species {
	id: number;
	name: string[];
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
	uploaded_by_name: string;
}

interface User {
	id: number;
	name: string;
	email: string;
	organization: string;
	is_staff: boolean;
	is_active: boolean;
	is_superuser: boolean;
	is_verified: boolean;
	approver_name: string[];
	password?: string;
	approver?: number[];
	// approver: number[];
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
	partition_function: {
		[name: string]: string;
	};
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
	vib_qn: string;
	qn_label_str: string;
	contains_rovibrational: boolean;
	cat_file_added: boolean;
}

interface Reference {
	id: string;
	doi: string;
	ref_url: string;
	bibtex: string;
	notes: string;
	uploaded_by: string;
	uploaded_by_name: string;
	approved: boolean;
}

interface MetaReference {
	id: number;
	meta: string;
	ref: string;
	dipole_moment: boolean;
	spectrum: boolean;
	notes: string;
	uploaded_by: string;
	approved: boolean;
	molecule_tag: number;
	species_formula: string;
	species_name: string;
	linelist_name: string;
	doi: string;
	ref_url: string;
	uploaded_by_name: string;
}
