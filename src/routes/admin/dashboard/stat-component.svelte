<script lang="ts">
	import { AlertCircle, CheckCheck } from 'lucide-svelte';
	export let total: number;
	export let approved: number;
	$: percent_approved = approved !== undefined && total > 0 ? approved / total : 0;
</script>

<div class="stat">
	<div class="stat-title flex gap-1">
		<slot name="header" />
	</div>

	{#if total > 0}
		<div
			class="stat-figure"
			class:text-red={percent_approved < 0.5}
			class:text-yellow-500={percent_approved >= 0.5 && percent_approved < 0.8}
			class:text-green-500={percent_approved >= 0.8}
		>
			{#if percent_approved >= 0.8}
				<CheckCheck />
			{:else}
				<AlertCircle />
			{/if}
		</div>

		<div class="stat-value">
			<span
				class="flex gap-1 items-center"
				class:text-red={percent_approved < 0.5}
				class:text-yellow-500={percent_approved >= 0.5 && percent_approved < 0.8}
				class:text-green-500={percent_approved >= 0.8}
			>
				{approved} / {total} approved
			</span>
		</div>
		<!-- <div class="stat-desc">
			Total uploaded : {total} items
		</div> -->
	{:else}
		<div class="stat-value">Nothing uploaded yet!</div>
	{/if}
</div>
