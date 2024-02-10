<script lang="ts">
	import { setContext } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Accordion from '$lib/components/ui/accordion';
	import ApproveSpeciesMetadata from './(meta-species)/approve-species-metadata.svelte';
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
	const grouped_by_species_formula: {
		[key: string]: SpeciesMetadata[];
	} = Object.groupBy(meta_species, (f) => f.species_formula);
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
							<Dialog.Root>
								<Dialog.Trigger>
									{obj.linelist_name.toLocaleUpperCase()} ({obj.molecule_tag})
								</Dialog.Trigger>
								<Dialog.Content class="max-w-[70%] sm:max-w-[90%] max-h-[70%] overflow-auto">
									<Dialog.Header>
										<Dialog.Title>
											{title} metadata from
											{obj.linelist_name.toLocaleUpperCase()} ({obj.molecule_tag})
										</Dialog.Title>
										<Dialog.Description>Approve species metadata</Dialog.Description>
									</Dialog.Header>
									<ApproveSpeciesMetadata {obj} />
								</Dialog.Content>
							</Dialog.Root>
						</li>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
{/each}
