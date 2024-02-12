<script lang="ts">
	import { setContext } from 'svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import MetaSpeciesItemsDialog from './(meta-species)/meta-species-items-dialog.svelte';
	import { groupBy } from 'lodash-es';
	export let meta_species: SpeciesMetadata[];

	const include_keys = [
		{
			key: 'molecule_tag',
			label: 'Molecule tag'
		},
		{
			key: 'linelist_name',
			label: 'Linelist name',
			formatter: (val: string) => val?.toLocaleUpperCase()
		},
		{ key: 'a_const', label: 'A' },
		{ key: 'b_const', label: 'B' },
		{ key: 'c_const', label: 'C' },
		{ key: 'mu_a', label: 'µA' },
		{ key: 'mu_b', label: 'µB' },
		{ key: 'mu_c', label: 'µC' },
		{
			key: 'hyperfine',
			label: 'Hyperfine',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		},
		{ key: 'degree_of_freedom', label: 'Degree of freedom' },
		{ key: 'category', label: 'Category' },
		{ key: 'notes', label: 'notes' }
	] as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
		is_link?: boolean;
		href?: string;
	}[];

	setContext('include_keys', include_keys);
	setContext('api_key', 'species-metadata');

	const grouped_by_species_formula = groupBy(meta_species, (f) => f.species_formula);
</script>

{#each Object.keys(grouped_by_species_formula) as species_formula}
	{@const species_name = grouped_by_species_formula[species_formula][0].species_name}
	{@const title = `${species_name} (${species_formula})`}
	<Accordion.Root class="w-full sm:max-w-[70%]">
		<Accordion.Item value={species_formula}>
			<Accordion.Trigger>{title}</Accordion.Trigger>
			<Accordion.Content>
				<div class="rounded-box max-w-lg">
					{#each grouped_by_species_formula[species_formula] as obj}
						<li class="hover:bg-gray-200 cursor-pointer rounded-4">
							<MetaSpeciesItemsDialog {obj} {title} />
						</li>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
{/each}
