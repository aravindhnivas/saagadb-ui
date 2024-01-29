<script lang="ts">
	import Loader from '$lib/components/utils/loader.svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import type { LayoutData } from './$types';
	import SpeciesData from './species-data.svelte';
	import MetaTable from './meta-table.svelte';

	export let data: LayoutData;
</script>

<div class="overflow-auto grid">
	{#await data.load_species_metadata}
		<Loader />
	{:then { species, meta }}
		{#if species?.message}
			<AlertBox message={species.message} variant="destructive" />
		{:else if species}
			<SpeciesData {species} />
			{#if meta.length > 0 && data.linelist}
				<MetaTable {meta} {species} linelist={data.linelist} />
			{/if}
		{/if}
	{:catch error}
		<AlertBox message={error.message} variant="destructive" />
	{/await}
</div>
