<script lang="ts">
	import type { PageData } from './$types';
	import Cite from 'citation-js';
	import { oO } from '@zmotivat0r/o0';
	import Fuzzy, { Highlighter } from 'svelte-fuzzy';
	import { onMount } from 'svelte';
	import type { FuzzyProps } from 'svelte-fuzzy/types/Fuzzy.svelte';
	import VirtualList from '@sveltejs/svelte-virtual-list';

	export let data: PageData;
	let refs: { name: string; doi: string }[] = [];
	let options: FuzzyProps['options'] = { keys: ['name'], distance: 50 }; // Fuzzy search options

	const parse_ref = async () => {
		refs = [];
		const references = await data.load;

		for (const ref of references) {
			const [err, cite] = await oO(Cite.async(ref.doi));
			if (err) return null;

			const citeas = cite.format('bibliography') as string;
			refs = [...refs, { name: citeas, doi: ref.doi }];
		}
		return refs;
	};

	let query = '';
	let mounted = false;
	let formatted: { text: string; matches: boolean; key: string }[][][] = [];
	onMount(async () => {
		const [err, result] = await oO(parse_ref());
		if (err) {
			mounted = true;
			return;
		}
		refs = result;
		mounted = true;
	});
</script>

<div class="grid gap-5 content-start overflow-hidden p-2">
	<input
		disabled={!mounted}
		class="input input-bordered"
		placeholder="Start typing to search for references..."
		bind:value={query}
	/>

	{#if mounted}
		<div class="content__div overflow-auto">
			<Fuzzy {query} data={refs} {options} bind:formatted />
			{#each formatted as item}
				{#each item as line}
					<!-- <VirtualList items={species} let:item={sp}> -->
					{#each line as { matches, text }}
						{#if matches}
							<mark>{text}</mark>
						{:else}
							{text}
						{/if}
					{/each}
					<!-- </VirtualList> -->
				{/each}
			{/each}
		</div>
	{:else}
		<div class="flex gap-2 items-center">
			<span class="loading loading-spinner"></span>
			<span>Parsing references please wait...</span>
		</div>
	{/if}
</div>
