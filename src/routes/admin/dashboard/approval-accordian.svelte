<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';

	export let meta_ref: MetaReference[];
	export let meta_species: SpeciesMetadata[];

	const meta_species_grouped = Object.groupBy(meta_species, (f) => f.species_formula);
	const meta_ref_grouped = Object.groupBy(meta_ref, (f) => f.species_formula);
	console.log(meta_species_grouped, meta_ref_grouped);

	let active_tab: 'species' | 'ref' = 'ref';
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

<!-- <Accordion.Root class="w-full sm:max-w-[70%]">
	<Accordion.Item value="item-2">
		<Accordion.Trigger>Show species-metadata</Accordion.Trigger>
		<Accordion.Content>{JSON.stringify(meta_species)}</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Show reference-metadata</Accordion.Trigger>
		<Accordion.Content>
			<ul class="menu w-56 rounded-box">
				<li class="menu-title">Title</li>
				<li><a>Item 1</a></li>
				<li><a>Item 2</a></li>
				<li><a>Item 3</a></li>
			</ul>
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root> -->
