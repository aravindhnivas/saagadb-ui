<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import BoxContent from './box-content.svelte';
	import { page } from '$app/stores';

	export let filtered_data: { [name: string]: string }[] = [];
	export let edit_criteria: (metadata: { [name: string]: string }) => boolean;

	let virtualListEl: HTMLDivElement;
	let virtualItemEls: HTMLDivElement[] = [];

	$: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
		count: filtered_data.length,
		getScrollElement: () => virtualListEl,
		estimateSize: () => 100,
		overscan: 5 // The number of items to render above and below the visible area.
	});
	$: items = $virtualizer.getVirtualItems();

	$: {
		if (virtualItemEls.length) virtualItemEls.forEach((el) => $virtualizer.measureElement(el));
	}
</script>

<div class="scroll-container" bind:this={virtualListEl}>
	<div style="position: relative; height: {$virtualizer.getTotalSize()}px; width: 100%;">
		<div
			style="position: absolute; top: 0; left: 0; width: 100%; transform: translateY({items[0]
				? items[0].start
				: 0}px);"
		>
			{#each items as row, idx (row.index)}
				{@const metadata = filtered_data[row.index]}
				<div class="max-w-xl py-2" bind:this={virtualItemEls[idx]} data-index={row.index}>
					<BoxContent
						id="{$page.params.apiName}-form-{metadata.id}"
						{metadata}
						edit={edit_criteria(metadata)}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.scroll-container {
		/* width: 700px; */
		min-height: 300px;
		max-height: calc(100vh - 400px);
		overflow: auto;
		padding: 1em;
		border-radius: 1em;
	}
</style>
