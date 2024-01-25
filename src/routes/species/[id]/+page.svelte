<script lang="ts">
	import type { LayoutData } from './$types';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import SpeciesData from './species-data.svelte';
	import MetaTable from './meta-table.svelte';

	export let data: LayoutData;
</script>

<div class="overflow-auto grid justify-center">
	{#await data.load_species_metadata}
		<div class="flex gap-2 items-center items-center">
			<span class="loading loading-spinner"></span>
			<span>Fetching data please wait...</span>
		</div>
	{:then { species, meta }}
		<SpeciesData {species} />
		<MetaTable {meta} {species} linelist={data.linelist} />
	{:catch error}
		<Alert.Root variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{error?.message ?? error}</Alert.Description>
		</Alert.Root>
	{/await}
</div>
