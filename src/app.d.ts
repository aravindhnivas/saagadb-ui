// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { RDKitModule } from '@rdkit/rdkit';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: string | null;
			domain: string;
		}
		interface PageState {
			ready: boolean;
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
		message?: string;
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
	}

	interface Linelist {
		id: number;
		linelist_name: string;
	}
	interface Meta {}

	interface Window {
		RDKit: RDKitModule;
	}
}

export {};
