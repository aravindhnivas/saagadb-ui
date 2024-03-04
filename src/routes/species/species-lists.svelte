<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import Svelecte from 'svelecte';
	import Label from '$lib/components/ui/label/label.svelte';
	import SearchInput from '$lib/components/custom-input/search-input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Separator } from '$lib/components/ui/separator';

	export let species: Species[] = [];
	export let user: User | null = null;

	let virtualListEl: HTMLDivElement;
	$: virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
		count: species.length,
		// count: 1000,
		getScrollElement: () => virtualListEl,
		estimateSize: () => 35,
		overscan: 1 // The number of items to render above and below the visible area.
		// debug: true
	});
	let searchKey = '';
	$: filteredSpecies = species.filter((sp) => {
		if (searchKey === '') return true;
		let val: string = '';
		filter_keys.forEach((key) => {
			if (key === 'name') val += ' ' + sp.name.join(' ');
			else val += ' ' + sp[key].toLowerCase();
		});
		return val.trim().includes(searchKey.toLowerCase());
	});

	let filter_keys = ['name', 'name_formula', 'iupac_name'] as const;
	let my_uploads = false;
	// console.log('species', species[0]);
	// console.log('user', user);
</script>

<div class="flex flex-col gap-4 mb-2">
	{#if user}
		<div class="flex gap-2 items-center">
			<Checkbox bind:checked={my_uploads} />
			<Label>My uploads only</Label>
		</div>
	{/if}
	<Label>Search in</Label>
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
			{#if sp && user ? (my_uploads ? sp.uploaded_by === user.id : true) : true}
				{@const active = Number($page.params.id) === sp.id}
				<div
					style="position: absolute; top: 0; left: 0; width: 100%; height: {row.size}px; transform: translateY({row.start}px);"
				>
					<!-- <a class="w-full {active ? 'border-black border-b-2' : ''} " href="{base}/species/{sp.id}" -->
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
		{/each}
	</div>
</div>

<style>
	.scroll-container {
		height: calc(100% - 15em);
		overflow: auto;
		border: solid 1px gray;
		padding: 1em;
		border-radius: 1em;
	}
</style>
