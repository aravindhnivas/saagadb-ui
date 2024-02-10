<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { getContext } from 'svelte';
	import ApproveTableRow from './approve-table-row.svelte';

	export let species_formula: string;
	export let grouped_by_species_formula: {
		[key: string]: MetaReference[];
	};

	const include_keys = getContext('include_keys') as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
		is_link?: boolean;
		href?: string;
	}[];

	const approve_btn = getContext('approve_btn');
</script>

<Table.Root class="text-md">
	<Table.Header>
		<Table.Row>
			<Table.Head />
			{#each include_keys.map((f) => f.label) as label}
				<Table.Head class="p-0.5 text-center">{label}</Table.Head>
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
