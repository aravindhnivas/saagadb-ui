<script lang="ts">
	import { base } from '$app/paths';
	import { AlertCircle, CheckCheck } from 'lucide-svelte/icons';
	import { getContext } from 'svelte';

	export let total: number;
	export let approved: number;
	export let apiName: string;

	$: percent_approved = approved !== undefined && total > 0 ? approved / total : 0;
	const user = getContext('user') as User;
</script>

<div class="stat">
	<div class="stat-title flex gap-1">
		<slot name="header" />
	</div>

	{#if total > 0}
		<div
			class="stat-figure"
			class:text-red={percent_approved < 0.5}
			class:text-yellow-500={percent_approved >= 0.5 && percent_approved < 1}
			class:text-green-500={percent_approved === 1}
		>
			{#if percent_approved >= 0.8}
				<CheckCheck />
			{:else}
				<AlertCircle />
			{/if}
		</div>

		<div class="stat-value">
			<div
				class="flex gap-1 items-center"
				class:text-red={percent_approved < 0.5}
				class:text-yellow-500={percent_approved >= 0.5 && percent_approved < 1}
				class:text-green-500={percent_approved === 1}
			>
				<a class="hover:underline" href="{base}/admin/dashboard/{user.id}/{apiName}">
					{approved} / {total} approved
				</a>
			</div>
		</div>
	{:else}
		<div class="stat-value">Nothing uploaded yet!</div>
	{/if}
</div>
