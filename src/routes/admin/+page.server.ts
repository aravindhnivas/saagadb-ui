import { redirect } from '@sveltejs/kit';
import type { PageServerData } from './$types';

export const load: PageServerData = () => {
	redirect(300, '/admin/dashboard');
};
