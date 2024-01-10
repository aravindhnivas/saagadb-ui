import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { DB_URL } from '$lib/server';

const schema = z.object({
	linelist_name: z.string().min(1)
});

export const load: PageServerLoad = async () => {
	const form = await superValidate(schema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, schema);
		console.log('POST', form.data);

		// Convenient validation check:
		if (!form.valid) {
			return fail(400, { form });
		}

		const res = await fetch(`${DB_URL}/data/linelist/`, {
			method: 'POST',
			body: JSON.stringify(form.data)
		});

		if (!res.ok) {
			try {
				const msg_json = await res.json();
				for (const [key, value] of Object.entries(msg_json) as [string, string][]) {
					setError(form, key, value);
				}
				return setError(form, '', 'Form is invalid');
			} catch (error) {
				console.log('error', error);
			}

			const msg = await res.text();
			message(form, msg);
			return;
		}

		const res_data = await res.json();
		return { form, response: res_data };
	}
};
