<script lang="ts">
	import { writable } from '@macfja/svelte-persistent-store';
	import MetaPane from './meta-pane.svelte';

	export let meta_ref: MetaReference[];
	export let meta_species: SpeciesMetadata[];

	const active_tab = writable('active_tab_approval_page', 'species');

	const species_keys = [
		'category',
		'hyperfine',
		'degree_of_freedom',
		'molecule_tag',
		'mu_a',
		'mu_b',
		'mu_c',
		'a_const',
		'b_const',
		'c_const',
		'data_date',
		'data_contributor',
		'qn_label_str',
		'vib_qn',
		'notes'
	];

	const metaref_keys = ['dipole_moment', 'spectrum', 'ref_url', 'notes'];
</script>

<div class="tabs">
	<button
		class="tab tab-bordered"
		class:tab-active={$active_tab === 'species'}
		on:click={() => ($active_tab = 'species')}
	>
		<span>Species metadata </span>
	</button>
	<button
		class="tab tab-bordered"
		class:tab-active={$active_tab === 'ref'}
		on:click={() => ($active_tab = 'ref')}
	>
		<span>Reference metadata </span>
	</button>
</div>

<div class="animate__animated animate__fadeIn">
	{#if $active_tab === 'species'}
		<MetaPane metadata={meta_species} include_keys={species_keys} api_key="species-metadata" />
	{:else if $active_tab === 'ref'}
		<MetaPane metadata={meta_ref} include_keys={metaref_keys} api_key="meta-reference" />
	{/if}
</div>
