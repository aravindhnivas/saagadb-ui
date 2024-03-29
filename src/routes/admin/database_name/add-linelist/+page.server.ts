import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';
import linelistSchema from './schema';
import type { z } from 'zod';

export const load: PageServerLoad = async () => {
	const form = await superValidate(linelistSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, linelistSchema);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		const res = await fetch(`${DB_URL}/data/linelist/`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			try {
				type SchemaType = z.infer<typeof linelistSchema>;
				type SchemaKeys = keyof SchemaType;
				const msg_json = await res.json() as Record<SchemaKeys, string>;
				for (const [key, value] of Object.entries(msg_json) as [SchemaKeys, string][]) {
					setError(form, key, value);
				}
				return fail(400, { form });
			} catch (error) {
				console.log('error', error);
			}

			const msg = await res.text();
			message(form, { type: 'error', text: msg });
			return;
		}

		const res_data = await res.json();
		message(form, {
			type: 'success',
			text: `Successfully added <em>${res_data.linelist_name}</em> to the database`
		});

		return { form, response: res_data };
	}
};
