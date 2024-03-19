// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { RDKitModule } from '@rdkit/rdkit';
declare global {
	namespace App {
		interface Error {
			message: string;
			title?: string;
		}
		interface Locals {
			access_token: string | null;
			refresh_token: string | null;
			// token: string | null;
			domain: string;
		}
		interface PageState {
			ready: boolean;
		}
		// interface PageData {}
		// interface Platform {}
	}

	interface Window {
		RDKit: RDKitModule;
	}
}

export {};
