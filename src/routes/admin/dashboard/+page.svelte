<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-svelte/icons';
	import UploadStatus from './upload-status.svelte';
	import { setContext } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';

	export let data: PageData;
	setContext('allow_edit', data.user.is_staff || data.user.is_superuser);
	$: if (data.user?.name) logged_in.set(data.user.name);
</script>

<div class="p-2 m-auto max-w-6xl">
	{#if data.user}
		<div class="w-max m-auto">
			<h1 class="text-2xl font-bold">Welcome, {data.user.name}</h1>
			<p class="text-lg">You are logged in as {data.user.email}</p>

			<!-- superuser or staff or regular user -->
			{#if data.user.is_superuser}
				<!-- superuser icon -->
				<p>Superuser</p>
			{:else if data.user.is_staff}
				<!-- staff -->
				<p>Staff</p>
			{:else}
				<!-- regular user -->
				<p>Regular user</p>
			{/if}
		</div>

		<button
			class="btn btn-sm my-5"
			on:click={async () => {
				await invalidate('fetch:upload_count');
			}}
		>
			Fetch upload count
		</button>
		<div class="alert mb-2">
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
		</div>

		<div class="grid gap-2">
			<button
				class="btn btn-info"
				on:click={async () => {
					await goto(`${base}/admin/dashboard/review-data`);
				}}
			>
				Click to review all uploaded data
				<ExternalLink />
			</button>
			<span class="text-lg font-bold">
				Click on the following titles to EDIT (non-approved; exception to Species) the uploaded data
			</span>

			<UploadStatus
				user={data.user}
				fetch_upload_count={data.fetch_upload_count(data.user)}
				show_header={false}
			/>
		</div>
	{:else}
		<p>Invalid user</p>
	{/if}
</div>
