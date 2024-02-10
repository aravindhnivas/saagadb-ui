<script lang="ts">
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';

	export let meta_ref: MetaReference[];
	export let meta_species: SpeciesMetadata[];

	// const meta_species_grouped = Object.groupBy(meta_species, (f) => f.species_formula);
	// const meta_ref_grouped = Object.groupBy(meta_ref, (f) => f.species_formula);
	// console.log(meta_species_grouped, meta_ref_grouped);
	let active_tab: 'species' | 'ref' = 'species';
</script>

<div class="tabs">
	<button
		class="tab tab-bordered"
		class:tab-active={active_tab === 'species'}
		on:click={() => (active_tab = 'species')}
	>
		Species metadata
	</button>
	<button
		class="tab tab-bordered"
		class:tab-active={active_tab === 'ref'}
		on:click={() => (active_tab = 'ref')}
	>
		Reference metadata
	</button>
</div>

{#if active_tab === 'species'}
	<MetaSpecies {meta_species} />
{:else if active_tab === 'ref'}
	<MetaRef {meta_ref} />
{/if}
