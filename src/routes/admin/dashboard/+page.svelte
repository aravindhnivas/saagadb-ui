<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import { AlertCircle, ShieldCheck } from 'lucide-svelte/icons';
	import UploadStatus from './upload-status.svelte';
	import { setContext } from 'svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	setContext('allow_edit', data.user.is_staff || data.user.is_superuser);
	$: if (data.user?.name) logged_in.set(data.user.name);
</script>

<div class="p-2 max-w-4xl">
	{#if data.user}
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
		<UploadStatus
			user={data.user}
			fetch_upload_count={data.fetch_upload_count(data.user)}
			show_header={false}
		/>
	{:else}
		<p>Invalid user</p>
	{/if}
</div>
