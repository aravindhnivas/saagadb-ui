<script lang="ts">
	import { setContext } from 'svelte';
	import { groupBy } from 'lodash-es';
	import * as Dialog from '$lib/components/ui/dialog';
	import ApproveListTable from './(meta-ref)/approve-list-table.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import { edit_ref_field } from './stores';
	import { enhance } from '$app/forms';
	export let meta_ref: MetaReference[];
	const include_keys = [
		{
			key: 'linelist_name',
			label: 'Linelist name',
			formatter: (val: string) => val?.toLocaleUpperCase(),
			editable: false
		},
		{
			key: 'dipole_moment',
			label: 'Dipole moment',
			formatter: (val: string) => (val ? '✅' : '❌')
		},
		{
			key: 'spectrum',
			label: 'Spectrum',
			formatter: (val: string) => (val ? '✅' : '❌')
		},
		{
			key: 'ref_url',
			label: 'Reference',
			is_link: true
		},
		{
			key: 'notes',
			label: 'Notes'
		}
	] as MetaRefApprovalItem[];

	const grouped_by_species_formula = groupBy(meta_ref, (f) => f.species_formula);
	setContext('include_keys', include_keys);
	setContext('api_key', 'meta-reference');
	// $: console.log({ $edit_ref_field });
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
						<Dialog.Description>
							<span>Check and approve the data</span>
							<div class="flex items-center space-x-2">
								<!-- <input type="checkbox" bind:checked={$edit_ref_field} class="checkbox" /> -->
								<Switch id="edit-mode" bind:checked={$edit_ref_field} />
								<Label for="edit-mode">Edit mode</Label>
							</div>
						</Dialog.Description>
					</Dialog.Header>
					<form use:enhance method="POST">
						<ApproveListTable {species_formula} {grouped_by_species_formula} />
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</li>
	{/each}
</div>
