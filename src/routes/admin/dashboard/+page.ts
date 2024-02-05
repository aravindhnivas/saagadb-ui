import { base } from '$app/paths';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const { user } = await parent();
	console.log('parentData', user);

	const fetch_approver = async () => {
		if (!user?.approver) return;
		const res = await fetch(`${base}/api/user/fetch/${user.approver}`);
		if (!res.ok) return;
		const approver: User = await res.json();
		return approver;
	};

	const fetch_approving_users = async () => {
		let approving_users: User[] = [];
		if (!user?.id) error(400, 'Invalid user ID');
		if (!user?.is_staff) error(403, 'User is not a staff');

		const res = await fetch(`${base}/api/user/fetch?approver=${user.id}`);
		if (!res.ok) error(500, 'Failed to fetch approving users');

		approving_users = (await res.json()) as User[];
		console.log('approving_users', approving_users);
		return approving_users;
	};

	return {
		fetch_approving_users,
		fetch_approver
	};
};
