import type { Actions, PageServerLoad } from './$types';
import { DB_URL } from '$lib/server';

export const load: PageServerLoad = async ({ fetch }) => {
	const linelist_res = await fetch(`/api/linelist`);

	if (!linelist_res.ok) return { linelist: [] };

	const linelist = (await linelist_res.json()) as {
		id: string;
		linelist_name: string;
	}[];

	return { linelist };
};

export const actions: Actions = {
	delete_table: async ({ request, fetch, url }) => {
		const data = await request.formData();
		const id = url.searchParams.get('id');
		// const id = data.get('id');
		const delete_reason = data.get('delete_reason');

		// console.log('id', id);
		// console.log('delete_reason', delete_reason);

		if (!(id && delete_reason)) {
			return { success: false, message: 'id and delete_reason are required' };
		}

		const res = await fetch(`${DB_URL}/data/linelist/${id}/?delete_reason=${delete_reason}`, {
			method: 'DELETE'
		});

		if (!res.ok) {
			const text = await res.json();
			return { success: false, message: text };
		}

		return {
			success: res.ok,
			message: res.ok ? 'Table deleted' : 'Error deleting table'
		};
	}
};
