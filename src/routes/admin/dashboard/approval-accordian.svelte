<script lang="ts">
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';
	import { writable } from '@macfja/svelte-persistent-store';
	// import { writable } from 'svelte/store';

	export let meta_ref: MetaReference[];
	export let meta_species: SpeciesMetadata[];

	const active_tab = writable('active_tab_approval_page', 'species');
</script>

<div class="tabs">
	<button
		class="tab tab-bordered"
		class:tab-active={$active_tab === 'species'}
		on:click={() => ($active_tab = 'species')}
	>
		Species metadata ({meta_species.length})
	</button>
	<button
		class="tab tab-bordered"
		class:tab-active={$active_tab === 'ref'}
		on:click={() => ($active_tab = 'ref')}
	>
		Reference metadata ({meta_ref.length})
	</button>
</div>

{#if $active_tab === 'species'}
	<MetaSpecies {meta_species} />
{:else if $active_tab === 'ref'}
	<MetaRef {meta_ref} />
{/if}
