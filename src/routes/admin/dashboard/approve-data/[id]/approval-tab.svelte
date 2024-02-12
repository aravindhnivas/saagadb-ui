<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { AlertCircle, CheckCheck } from 'lucide-svelte';
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';
	import { writable } from '@macfja/svelte-persistent-store';

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
		<div class="flex gap-4 items-center">
			<span>Species metadata </span>
			{#if meta_species.length > 0}
				<span>({meta_species.length})</span>
				<span><AlertCircle color="orange" /> </span>
			{:else}
				<span><CheckCheck color="green" /></span>
			{/if}
		</div>
	</button>
	<button
		class="tab tab-bordered"
		class:tab-active={$active_tab === 'ref'}
		on:click={() => ($active_tab = 'ref')}
	>
		<div class="flex gap-4 items-center">
			<span>Reference metadata </span>
			{#if meta_ref.length > 0}
				<span>({meta_ref.length})</span>
				<span><AlertCircle color="orange" /> </span>
			{:else}
				<span><CheckCheck color="green" /></span>
			{/if}
		</div>
	</button>
</div>

<div class="animate__animated animate__fadeIn">
	{#if $active_tab === 'species'}
		{#if meta_species.length > 0}
			<MetaSpecies {meta_species} />
		{:else}
			<AlertBox message="All species metadata has been approved" title="Approved">
				<CheckCheck class="h-4 w-4" />
			</AlertBox>
		{/if}
	{:else if $active_tab === 'ref'}
		{#if meta_ref.length > 0}
			<MetaRef {meta_ref} />
		{:else}
			<AlertBox message="All reference metadata has been approved" title="Approved">
				<CheckCheck class="h-4 w-4" />
			</AlertBox>
		{/if}
	{/if}
</div>
