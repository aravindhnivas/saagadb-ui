import { base } from '$app/paths';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	// const fetch_approver = async () => {
	// 	const res = await fetch(`${base}/api/user/fetch/${user.approver}`);
	// 	if (!res.ok) return;
	// 	const approver: User = await res.json();
	// 	return approver;
	// };

	const fetch_approving_users = async () => {
		let approving_users: User[] = [];
		if (!user.is_staff)
			error(403, {
				title: 'Unauthorized',
				message: 'You do not have permission to access this page'
			});

		const res = await fetch(`${base}/api/user/fetch?approver=${user.id}`);
		if (!res.ok)
			error(500, {
				title: 'Server Error',
				message: 'Failed to fetch approving users'
			});

		approving_users = (await res.json()) as User[];
		return approving_users;
	};

	const fetch_upload_count = async () => {
		const res = await fetch(`${base}/api/data/data_length/${user.id}`);
		if (!res.ok)
			error(500, {
				title: 'Server Error',
				message: 'Failed to fetch upload count'
			});
		const upload_count = (await res.json()) as UploadCountResponse;

		return upload_count;
	};

	return {
		fetch_approving_users: user?.is_staff ? fetch_approving_users() : undefined,
		fetch_upload_count: fetch_upload_count()
		// fetch_approver: fetch_approver()
	};
};
