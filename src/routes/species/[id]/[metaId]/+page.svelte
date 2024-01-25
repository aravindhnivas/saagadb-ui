<script lang="ts">
	import type { PageData } from './$types';
	import { AlertCircle, ArrowBigLeft } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import MetaRefTable from './meta-ref-table.svelte';
	import MetaPartitionTable from './meta-partition-table.svelte';
	import { Button } from '$lib/components/ui/button';
	import { base } from '$app/paths';
	import { page } from '$app/stores';

	export let data: PageData;
	// export let info: string;

	console.log(data);
</script>

<!-- show back button only in non-dialog mode -->
{#if $page.params.metaId}
	{#await data.load_species_metadata then { species, meta }}
		{@const metadata = meta.find((f) => f.id == $page.params.metaId)}
		{@const key = data.linelist?.find((f) => f.id == metadata.linelist)?.linelist_name}
		{@const meta_name = key ? key.toUpperCase() : 'Unknown'}
		<div class="text-lg font-400 flex justify-center">
			<span
				>Reference and metadata for <em class="font-bold">{species.iupac_name}</em>
				from {meta_name}
				database</span
			>
		</div>
	{/await}
	<Button class="flex items-center w-[200px]" variant="outline">
		<a href="{base}/species/{$page.params.id}" class="w-full flex gap-2 items-center justify-center"
			><ArrowBigLeft /><span>Go back</span></a
		>
	</Button>
{/if}

{#await data.load_meta_reference}
	<div class="flex gap-2 items-center">
		<span class="loading loading-spinner"></span>
		<span>Fetching data please wait...</span>
	</div>
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
				<div class="flex gap-2 items-center justify-center text-error">
					<AlertCircle />
					<span>{error.message}</span>
				</div>
			{/await}
		</div>
	</div>
{:catch error}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{error?.message ?? error}</Alert.Description>
	</Alert.Root>
{/await}
