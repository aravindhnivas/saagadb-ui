<script lang="ts">
	import type { PageData } from './$types';
	import { AlertCircle, Download } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import MetaRefTable from './meta-ref-table.svelte';
	import MetaPartitionTable from './meta-partition-table.svelte';

	export let data: PageData;
</script>

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
