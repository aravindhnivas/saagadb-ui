<script lang="ts">
	import Loader from '$lib/components/utils/loader.svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import type { LayoutData } from './$types';
	import SpeciesData from './species-data.svelte';
	import MetaTable from './meta-table.svelte';

	export let data: LayoutData;
</script>

{#await data.load_species_metadata}
	<Loader />
{:then { species, meta }}
	{#if species?.message}
		<AlertBox message={species.message} variant="destructive" />
	{:else if species}
		<SpeciesData {species} user={data.user} />
		{#if meta.length > 0}
			<MetaTable species_metadata={meta} />
		{:else}
			<AlertBox message="No data available for this species" />
		{/if}
	{/if}
{:catch error}
	<AlertBox {error} />
{/await}
