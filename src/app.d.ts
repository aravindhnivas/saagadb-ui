// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { RDKitModule } from '@rdkit/rdkit';
declare global {
	namespace App {
		interface Error {
			message: string;
			title?: string;
		}
		interface Locals extends TokenDecodedUser {
			access_token?: string;
			refresh_token?: string;
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
		CrossRef: any;
	}
}

export {};
