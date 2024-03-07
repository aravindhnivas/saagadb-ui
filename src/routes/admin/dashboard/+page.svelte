<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import { AlertCircle, ShieldCheck } from 'lucide-svelte/icons';
	import UploadStatus from './upload-status.svelte';
	import DependentUser from './dependent-user.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { setContext } from 'svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { invalidate } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { sessionWritable } from '@macfja/svelte-persistent-store';

	export let data: PageData;
	// setContext('approve_btn', false);
	setContext('allow_edit', data.user.is_staff || data.user.is_superuser);
	$: if (data.user?.name) logged_in.set(data.user.name);
	const active_tab = sessionWritable('dashboard-active-tab', 'upload-statistics');
</script>

{#if data.user}
	<Tabs.Root value={$active_tab}>
		<Tabs.List class="grid w-full grid-cols-2 max-w-md">
			<Tabs.Trigger value="upload-statistics" on:click={() => ($active_tab = 'upload-statistics')}
				>Upload statistics</Tabs.Trigger
			>
			<Tabs.Trigger value="approve-data" on:click={() => ($active_tab = 'approve-data')}
				>Approve data</Tabs.Trigger
			>
		</Tabs.List>

		<Tabs.Content value="upload-statistics">
			<Card.Root>
				<Card.Header>
					<Card.Title>Upload statistics</Card.Title>
					<Card.Description>
						You can see the statistics of the data uploaded by you and the approval status
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="alert mb-2">
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
						fetch_upload_count={data.fetch_upload_count(data.user)}
						show_header={false}
					/>
				</Card.Content>
				<Card.Footer>
					<Button
						class="ml-auto"
						on:click={async () => {
							await invalidate('fetch:upload_count');
							toast.success('Data re-fetched');
						}}>Re-fetch data</Button
					>
				</Card.Footer>
			</Card.Root>
		</Tabs.Content>
		<Tabs.Content value="approve-data">
			{#if data.fetch_approving_users && (data.user.is_staff || data.user.is_superuser)}
				<Card.Root>
					<Card.Header>
						<Card.Title>Dependent users</Card.Title>
						<Card.Description>Approve the data uploaded by the following users</Card.Description>
					</Card.Header>
					<Card.Content>
						<DependentUser fetch_approving_users={data.fetch_approving_users(data.user)} />
					</Card.Content>
					<Card.Footer>
						<Button
							class="ml-auto"
							on:click={async () => {
								await invalidate('fetch:approving_users');
								toast.success('Data re-fetched');
							}}>Re-fetch data</Button
						>
					</Card.Footer>
				</Card.Root>
			{:else}
				<AlertBox message="Requires staff/superuser permission" title="Unauthorized" />
			{/if}
		</Tabs.Content>
	</Tabs.Root>
{:else}
	<p>Invalid user</p>
{/if}
