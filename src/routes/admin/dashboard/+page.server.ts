import { base } from '$app/paths';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

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
		// console.log('approving_users', approving_users);
		return approving_users;
	};

	const fetch_ref_and_species = async () => {
		if (!user?.id) error(400, 'User ID not provided');

		const res = await fetch(`${base}/api/data/meta-ref-and-species?uploaded_by=${user.id}`);
		if (!res.ok) return { MetaReference: [], SpeciesMetadata: [] };

		const ref_and_species = (await res.json()) as {
			MetaReference: MetaReference[];
			SpeciesMetadata: SpeciesMetadata[];
		};

		return ref_and_species;
	};

	return {
		fetch_approving_users: fetch_approving_users(),
		fetch_ref_and_species: fetch_ref_and_species(),
		fetch_approver: fetch_approver()
	};
};
