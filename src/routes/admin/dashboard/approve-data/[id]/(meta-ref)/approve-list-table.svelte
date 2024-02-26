<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { getContext } from 'svelte';
	import ApproveTableRow from './approve-table-row.svelte';
	import { edit_ref_field } from '../stores';
	export let species_formula: string;
	export let grouped_by_species_formula: {
		[key: string]: MetaReference[];
	};
	const include_keys = getContext('include_keys') as MetaRefApprovalItem[];
	const approve_btn = getContext('approve_btn');
</script>

<Table.Root class="text-md">
	<Table.Header>
		<Table.Row>
			{#if !$edit_ref_field}
				<Table.Head />
			{/if}

			{#each include_keys.map((f) => f.label) as label}
				<Table.Head class="p-0.5 {label !== 'Reference' && 'text-center'}">{label}</Table.Head>
			{/each}
			{#if approve_btn}
				<Table.Head />
			{/if}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each grouped_by_species_formula[species_formula] as obj}
			<ApproveTableRow {obj} />
		{/each}
	</Table.Body>
</Table.Root>
