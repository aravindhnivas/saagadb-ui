<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import { AlertCircle, ShieldCheck } from 'lucide-svelte';
	import * as Table from '$lib/components/ui/table';
	import UploadStatus from './upload-status.svelte';
	import { base } from '$app/paths';
	export let data: PageData;
	const { user } = data;
	$: if (user?.name) logged_in.set(user.name);

	// console.log({ user });
</script>

<div class="grid gap-4 p-4">
	{#if user}
		<div class="alert">
			{#await data.fetch_approver() then approver}
				{#if approver}
					<ShieldCheck />
					<span>Approver: {approver.name} ({approver.email})</span>
				{:else}
					<AlertCircle />
					<span>No approver assigned</span>
				{/if}
			{/await}
		</div>

		<UploadStatus {user} />

		{#if user.is_staff}
			{#await data.fetch_approving_users()}
				<Loader fetching={true} />
			{:then approving_users}
				<h1 class="text-2xl font-bold">
					Dependent user - approve the data uploaded by the following users
				</h1>
				{#if approving_users.length > 0}
					<Table.Root class="max-w-md">
						<Table.Body>
							{#each approving_users as approving_user, ind}
								<Table.Row>
									<Table.Cell class="p-0.5">{ind + 1}</Table.Cell>
									<Table.Cell class="font-medium p-0.5">
										<a
											href="{base}/admin/dashboard/approve-data/{approving_user.id}"
											class="hover:underline">{approving_user.name}</a
										>
									</Table.Cell>
									<Table.Cell class="p-0.5">{approving_user.email}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{:else}
					<span>No approving users</span>
				{/if}
			{:catch error}
				<AlertBox {error} />
			{/await}
		{/if}
	{:else}
		<p>Invalid user</p>
	{/if}
</div>
