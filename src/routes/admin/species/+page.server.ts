import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { superValidate, setError } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

// const species_items = {
// 	name: '',
// 	iupac_name: '',
// 	name_formula: '',
// 	name_html: '',
// 	smiles: '',
// 	standard_inchi: '',
// 	standard_inchi_key: '',
// 	notes: ''
// } as const;

const schema = z.object({
	name: z.string().min(1),
	iupac_name: z.string().min(1),
	name_formula: z.string().min(1),
	name_html: z.string(),
	smiles: z.string().min(1),
	standard_inchi: z.string().min(1),
	standard_inchi_key: z.string().min(1),
	notes: z.string()
});

export const load: PageServerLoad = async (event) => {
	// Server API:
	const form = await superValidate(event, schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;
		console.log('data', data);
	}
};
