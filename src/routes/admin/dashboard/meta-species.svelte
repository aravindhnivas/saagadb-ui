<script lang="ts">
	import StatComponent from './stat-component.svelte';
	import { Atom } from 'lucide-svelte';
	export let meta_species: SpeciesMetadata[];

	const meta_species_grouped = Object.groupBy(meta_species, ({ species }) => species);
	console.log({ meta_species, meta_species_grouped });
</script>

<StatComponent total={meta_species.length} approved={meta_species.filter((f) => f.approved).length}>
	<svelte:fragment slot="header">
		<Atom />
		<span>Species-metadata</span>
	</svelte:fragment>
</StatComponent>
