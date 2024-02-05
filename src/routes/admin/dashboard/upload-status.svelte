<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';
	// import { fetch_ref_and_species } from '$lib/utils/fetch-data';
	export let user: User;
	export let fetch_ref_and_species: () => Promise<{
		MetaReference: MetaReference[];
		SpeciesMetadata: SpeciesMetadata[];
	}>;
</script>

{#if user}
	<div class="grid gap-4">
		{#await fetch_ref_and_species()}
			<Loader fetching={true} />
		{:then value}
			{#if value}
				<h1 class="text-2xl font-bold">Upload status for {user.name}</h1>
				<div class="stats stats-horizontal shadow">
					<MetaRef meta_ref={value.MetaReference} />
					<MetaSpecies meta_species={value.SpeciesMetadata} />
				</div>
			{:else}
				<p>Nothing uploaded by {user.name}</p>
			{/if}
		{:catch error}
			<AlertBox {error} />
		{/await}
	</div>
{:else}
	<p>No user found</p>
{/if}
