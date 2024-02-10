<script lang="ts">
	import { setContext } from 'svelte';
	// import MetaTemplate from './(meta-template)/meta-template.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import ApproveListTable from './(meta-ref)/approve-list-table.svelte';

	export let meta_ref: MetaReference[];
	const include_keys = [
		{
			key: 'linelist_name',
			label: 'Linelist name',
			formatter: (val: string) => val?.toLocaleUpperCase()
		},
		{
			key: 'dipole_moment',
			label: 'Dipole moment',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		},
		{
			key: 'spectrum',
			label: 'Spectrum',
			formatter: (val: string) => (val === 'true' ? '✅' : '❌')
		},
		{
			key: 'ref_url',
			label: 'Reference',
			is_link: true
		}
	] as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
		is_link?: boolean;
		href?: string;
	}[];

	const grouped_by_species_formula: {
		[key: string]: MetaReference[];
	} = Object.groupBy(meta_ref, (f) => f.species_formula);

	setContext('include_keys', include_keys);
	setContext('api_key', 'meta-reference');
</script>

<!-- <MetaTemplate obj={meta_ref} /> -->
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
