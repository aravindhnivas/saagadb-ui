import { redirect } from '@sveltejs/kit';

export const load = () => {
	redirect(303, '/admin/meta/species-metadata');
};
