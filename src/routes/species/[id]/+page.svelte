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
{:then { species, species_metadata, species_metadata_approved, species_metadata_pending }}
	{#if species?.message}
		<AlertBox message={species.message} variant="destructive" />
	{:else if species}
		<SpeciesData {species} user={data.user} />
		{#if species_metadata.length === 0}
			<AlertBox message="No data available for this species" />
		{:else if species_metadata_pending.length > 0}
			<AlertBox
				title="Awaiting review from approver"
				message="{species_metadata_pending.length} review pending"
			/>
		{/if}
		{#if species_metadata_approved.length > 0}
			<MetaTable species_metadata={species_metadata_approved} />
		{/if}
	{/if}
{:catch error}
	<AlertBox {error} />
{/await}
