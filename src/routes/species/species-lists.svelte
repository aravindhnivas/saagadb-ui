<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import Svelecte from 'svelecte';
	import Label from '$lib/components/ui/label/label.svelte';
	import SearchInput from '$lib/components/custom-input/search-input.svelte';
	// import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Separator } from '$lib/components/ui/separator';

	export let species: Species[] = [];
	// export let user: User | null = null;

	let virtualListEl: HTMLDivElement;
	$: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
		count: species.length,
		// count: 1000,
		getScrollElement: () => virtualListEl,
		estimateSize: () => 35,
		overscan: 5 // The number of items to render above and below the visible area.
		// debug: true
	});
	let searchKey = '';
	$: filteredSpecies = species.filter((sp) => {
		if (searchKey === '' || filter_keys.length === 0) return true;
		let val: string = '';
		filter_keys.forEach((key) => {
			if (key === 'name') val += ' ' + sp.name.join(' ');
			else val += ' ' + sp[key].toLowerCase();
		});
		return val.trim().includes(searchKey.toLowerCase());
	});

	let filter_keys = ['name', 'name_formula', 'iupac_name'];
</script>

<div class="flex flex-col gap-4 mb-2">
	<Label>
		Search in (<span class="text-sm ml-auto w-full">{species.length} species available</span>)
	</Label>
	<Svelecte
		searchable={false}
		multiple
		options={['name', 'name_formula', 'iupac_name']}
		bind:value={filter_keys}
	/>
	<SearchInput bind:searchKey />
</div>

<div class="scroll-container" bind:this={virtualListEl}>
	<div style="position: relative; height: {$virtualizer.getTotalSize()}px; width: 100%;">
		{#each $virtualizer.getVirtualItems() as row (row.index)}
			{@const sp = filteredSpecies[row.index]}
			{#if sp}
				{@const active = Number($page.params?.id) === sp?.id}
				<div
					style="position: absolute; top: 0; left: 0; width: 100%; height: {row.size}px; transform: translateY({row.start}px);"
				>
					<a class="w-full {active ? 'text-blue-500' : ''} " href="{base}/species/{sp.id}"
						>{#if sp.name_html}
							{@html sp.name_html}
						{:else}
							{sp.iupac_name ?? sp.name_formula}
						{/if}</a
					>
					<Separator />
				</div>
			{/if}
		{:else}
			<span>No species found</span>
		{/each}
	</div>
</div>

<!-- <span class="text-sm ml-auto w-full">{species.length} species available</span> -->

<style>
	.scroll-container {
		min-height: 300px;
		max-height: calc(100vh - 200px);
		overflow: auto;
		border: solid 1px gray;
		padding: 1em;
		border-radius: 1em;
	}
</style>
