<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';

	export let items: { id: string | number; label: string }[] = [];
	let virtualListEl: HTMLDivElement;
	$: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
		count: items.length,
		getScrollElement: () => virtualListEl,
		estimateSize: () => 35
		// overscan: 5
	});
</script>

<div class="scroll-container" bind:this={virtualListEl}>
	<div style="position: relative; height: {$virtualizer.getTotalSize()}px; width: 100%;">
		{#each $virtualizer.getVirtualItems() as row (row.index)}
			<div
				style="position: absolute; top: 0; left: 0; width: 100%; height: {row.size}px; transform: translateY({row.start}px);"
			>
				<!-- Row {row.index} -->
				{items[row.index].label}
			</div>
		{/each}
	</div>
</div>

<style>
	.scroll-container {
		height: 70vh;
		overflow: auto;
	}
</style>
