// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: string | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
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
	}
	interface Meta {}
}

export {};
