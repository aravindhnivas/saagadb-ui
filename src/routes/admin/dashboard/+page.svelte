<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import { AlertCircle, ShieldCheck } from 'lucide-svelte';
	import UploadStatus from './upload-status.svelte';
	import DependentUser from './dependent-user.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { setContext } from 'svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';

	export let data: PageData;
	setContext('approve_btn', false);

	const { user, fetch_approver, fetch_approving_users, fetch_ref_and_species } = data;
	$: if (user?.name) logged_in.set(user.name);

	// console.log({ data });
</script>

<div class="grid gap-4 p-4"></div>
{#if user}
	<Tabs.Root value="upload-statistics">
		<Tabs.List class="grid w-full grid-cols-2 max-w-md">
			<Tabs.Trigger value="upload-statistics">Upload statistics</Tabs.Trigger>
			<Tabs.Trigger value="approve-data">Approve data</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="upload-statistics">
			<Card.Root>
				<Card.Header>
					<Card.Title>Upload statistics</Card.Title>
					<Card.Description>
						You can see the statistics of the data uploaded by you and the approval status
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="alert">
						{#await fetch_approver then approver}
							{#if approver}
								<ShieldCheck />
								<span>Approver: {approver.name} ({approver.email})</span>
							{:else}
								<AlertCircle />
								<span>No approver assigned</span>
							{/if}
						{/await}
					</div>

					<UploadStatus {user} {fetch_ref_and_species} show_header={false} />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="approve-data">
			<Card.Root>
				<Card.Header>
					<Card.Title>Dependent users</Card.Title>
					<Card.Description>Approve the data uploaded by the following users</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2"></Card.Content>
				<Card.Footer>
					{#if user.is_staff}
						<DependentUser {fetch_approving_users} />
					{:else}
						<AlertBox message="Requires staff/superuser permission" title="Unauthorized" />
					{/if}
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
{:else}
	<p>Invalid user</p>
{/if}
