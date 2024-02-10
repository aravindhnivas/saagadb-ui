<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import ApproveListTable from './approve-list-table.svelte';

	export let obj: SpeciesMetadata[] | MetaReference[];

	const grouped_by_species_formula: {
		[key: string]: typeof obj;
	} = Object.groupBy(obj, (f) => f.species_formula);

	// console.log({ obj, grouped_by_species_formula });
</script>

<div class="rounded-box max-w-lg">
	{#each Object.keys(grouped_by_species_formula) as species_formula}
		{@const species_name = grouped_by_species_formula[species_formula][0].species_name}
		{@const title = `${species_name} (${species_formula})`}
		<li class="hover:bg-base-200">
			<Dialog.Root>
				<Dialog.Trigger>{title}</Dialog.Trigger>
				<Dialog.Content class="max-w-[70%] sm:max-w-[90%] max-h-[70%]">
					<Dialog.Header>
						<Dialog.Title>{title}</Dialog.Title>
						<Dialog.Description>Check and approve the data</Dialog.Description>
					</Dialog.Header>
					<ApproveListTable {species_formula} {grouped_by_species_formula} />
				</Dialog.Content>
			</Dialog.Root>
		</li>
	{/each}
</div>
