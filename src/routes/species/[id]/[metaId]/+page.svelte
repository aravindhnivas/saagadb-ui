<script lang="ts">
	import type { PageData } from './$types';
	import { ArrowBigLeft } from 'lucide-svelte';
	import MetaRefTable from './meta-ref-table.svelte';
	import MetaPartitionTable from './meta-partition-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';

	export let data: PageData;

	let species_loaded = false;
	const load_species_metadata = async () => {
		const { species, meta } = await data.load_species_metadata;
		if (species?.message)
			throw new Error(`Species with id ${$page.params.id} - ${species.message}`);
		if (meta.length === 0) throw new Error('No metadata found');
		species_loaded = true;
		return { species, meta };
	};
</script>

<!-- show back button only in non-dialog mode -->
{#if $page.params.metaId}
	{#await load_species_metadata() then { species, meta }}
		{@const metadata = meta.find((f) => f.id == $page.params.metaId)}
		{@const key = data.linelist?.find((f) => f.id == metadata?.linelist)?.linelist_name}
		{@const meta_name = key ? key.toUpperCase() : 'Unknown'}
		<div class="text-lg font-400 flex justify-center">
			<span
				>Reference and metadata for <em class="font-bold">{species.iupac_name}</em>
				from {meta_name}
				database</span
			>
		</div>
	{:catch error}
		<AlertBox message={error.message} variant="destructive" />
	{/await}
	{#if species_loaded}
		<Button class="flex items-center w-[200px]" variant="outline">
			<a
				href="{base}/species/{$page.params.id}"
				class="w-full flex gap-2 items-center justify-center"
				><ArrowBigLeft /><span>Go back</span></a
			>
		</Button>
	{/if}
{/if}

{#if species_loaded}
	{#await data.load_meta_reference}
		<Loader />
	{:then { meta_references, references }}
		<div class="grid gap-4 p-5">
			<MetaRefTable {meta_references} {references} />

			<div class="space-y-2">
				{#await data.load_species_metadata}
					<div class="flex gap-2 items-center">
						<span class="loading loading-spinner"></span>
						<span>Fetching partition please wait...</span>
					</div>
				{:then { meta }}
					{#if meta && meta.length > 0}
						<MetaPartitionTable {meta} id={data.id} />
					{:else}
						<p class="text-center">No partition table available</p>
					{/if}
				{:catch error}
					<AlertBox message={error.message} variant="destructive" />
				{/await}
			</div>
		</div>
	{:catch error}
		<AlertBox message={error.message} variant="destructive" />
	{/await}
{/if}
