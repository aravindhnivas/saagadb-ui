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
	import { invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	export let data: PageData;
	setContext('approve_btn', false);
	$: if (data.user?.name) logged_in.set(data.user.name);
</script>

{#if data.user}
	<Tabs.Root value="upload-statistics">
		<Tabs.List class="grid w-full grid-cols-2 max-w-md">
			<Tabs.Trigger value="upload-statistics">Upload statistics</Tabs.Trigger>
			<Tabs.Trigger value="approve-data">Approve data</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="upload-statistics">
			<Card.Root>
				<Card.Header>
					<div class="flex gap-4 items-center">
						<Card.Title>Upload statistics</Card.Title>
						<Button
							class="ml-auto"
							on:click={async () => {
								await invalidateAll();
								toast.success('Data re-fetched');
							}}>Re-fetch data</Button
						>
					</div>
					<Card.Description>
						You can see the statistics of the data uploaded by you and the approval status
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2">
					<div class="alert">
						<!-- {#await data.fetch_approver then approver} -->
						{#if data.user.approver_name}
							{@const approver_name = data.user.approver_name}
							{@const approver_name_str =
								approver_name.length > 1
									? `${approver_name.slice(0, -1).join(', ')} and ${approver_name[approver_name.length - 1]}`
									: approver_name[0] || ''}
							<ShieldCheck />
							<span>Approver: {approver_name_str}</span>
						{:else}
							<AlertCircle />
							<span>No approver assigned</span>
						{/if}
						<!-- {/await} -->
					</div>

					<UploadStatus
						user={data.user}
						fetch_upload_count={data.fetch_upload_count}
						show_header={false}
					/>
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="approve-data">
			<Card.Root>
				<Card.Header>
					<!-- <Card.Title>Dependent users</Card.Title> -->
					<div class="flex gap-4 items-center">
						<Card.Title>Dependent users</Card.Title>
						<Button
							class="ml-auto"
							on:click={async () => {
								await invalidateAll();
								toast.success('Data re-fetched');
							}}>Re-fetch data</Button
						>
					</div>
					<Card.Description>Approve the data uploaded by the following users</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-2"></Card.Content>
				<Card.Footer>
					{#if data.fetch_approving_users && data.user.is_staff}
						<DependentUser fetch_approving_users={data.fetch_approving_users} />
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
