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
	update_table: async ({ request, fetch, url }) => {
		const data = await request.formData();
		const id = url.searchParams.get('id') as string;
		const method = url.searchParams.get('method') as 'DELETE' | 'PATCH' | 'PUT';
		const _change_reason = data.get('reason') as string;
		const linelist_name = data.get('changed_name') as string;
		console.log({ id, method, _change_reason, linelist_name });
		// return { success: false, message: 'method not implemented' };
		if (!(id && _change_reason)) {
			return { success: false, message: 'id and reason are required' };
		}
		let res: Response;

		if (method === 'PATCH' || method === 'PUT') {
			res = await fetch(`${DB_URL}/data/linelist/${id}/`, {
				method,
				body: JSON.stringify({ _change_reason, linelist_name })
			});
		} else if (method === 'DELETE') {
			res = await fetch(
				`${DB_URL}/data/linelist/${id}/?delete_reason=${encodeURIComponent(_change_reason)}`,
				{
					method: 'DELETE'
				}
			);
		} else {
			return { success: false, message: 'invalid method requested: ' + method };
		}

		if (!res.ok) {
			const text = await res.json();
			return { success: false, message: text };
		}

		return {
			success: res.ok,
			message: res.ok ? 'Table update' : 'Error updating table'
		};
	}
};
