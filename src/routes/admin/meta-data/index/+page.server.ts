import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { schemas, ids } from '$lib/utils/schemas/meta';
import type { SuperValidated } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	const forms: {
		[key: string]: SuperValidated<(typeof schemas)[number]>;
	} = {};

	for (const id of ids) {
		const schema = schemas[id];
		forms[id] = await superValidate(schema, { id });
	}

	return { forms };
};
