import { base } from '$app/paths';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, params }) => {
	const fetch_upload_count = async (user: User) => {
		depends('fetch:upload_count_from_id');
		const res = await fetch(`${base}/api/data/data_length/${user.id}`);
		if (!res.ok) {
			error(500, {
				title: 'Server Error',
				message: 'Failed to fetch upload count'
			});
		}
		const upload_count = (await res.json()) as UploadCountResponse;
		return upload_count;
	};

	const fetch_user = async () => {
		depends('fetch:user_from_id');
		const res = await fetch(`${base}/api/user/fetch/${params.id}`);
		if (!res.ok) {
			error(500, {
				title: 'Server Error',
				message: 'Failed to fetch user'
			});
		}
		const user = (await res.json()) as User;
		return user;
	};

	return {
		fetch_upload_count,
		user: await fetch_user()
	};
};
