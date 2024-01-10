import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	name: z.string().min(1).default('C3H3'),
	iupac_name: z.string().min(1).default('cyclopropa-1-yn-3-ylradical'),
	name_formula: z.string().min(1).default('C3H3'),
	name_html: z.string().min(1).default('C<sub>3</sub>H<sub>3</sub>'),
	smiles: z.string().min(1).default('[CH]1C#C1'),
	standard_inchi: z.string().min(1).default('InChI=1S/C3H/c1-2-3-1/h1H'),
	standard_inchi_key: z.string().min(1).default('BNZFPDMLDDZTCS-UHFFFAOYSA-N'),
	notes: z.string().min(10).optional()
});

export const load: PageServerLoad = async ({ request }) => {
	// Server API:
	const form = await superValidate(request, schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await superValidate(request, schema);
		// console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const { name, ...restData } = form.data;
		const name_arr = name.split(',').map((s) => s.trim());

		// TODO: Do something with the validated form.data
		const res = await fetch(`${DB_URL}/data/species/`, {
			method: 'POST',
			body: JSON.stringify({ name: name_arr, ...restData })
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				const [key, value] = Object.entries(msg_json)[0] as [string, string];
				return setError(form, key, value);
			} catch (error) {
				console.log('error', error);
			}
			const msg = await res.text();
			message(form, msg);
			return;
		}

		const res_data = await res.json();
		console.log({ res_data });
		// Yep, return { form } here too
		return { form, response: res_data };
	}
};
