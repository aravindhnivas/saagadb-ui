<script lang="ts">
	import { base } from '$app/paths';
	import * as Table from '$lib/components/ui/table';
	import { Download } from 'lucide-svelte/icons';

	export let meta = [];
	export let id = '';
	const current_meta = meta.find((m) => m.id == id);
	const { partition_function, qpart_file } = current_meta ?? {};
	const qpart_filename = qpart_file?.split('/').pop();
	const cell_padding = 'p-2';
	// console.log(partition_function);

	const qpart_arr = Object.entries(partition_function).sort((a, b) => a[1].localeCompare(b[1]));
</script>

{#if partition_function}
	<div class="flex gap-4 items-center">
		<h1>Parition function</h1>
		<a href="{base}/uploads/sp/{qpart_filename}" download target="_blank" rel="noopener noreferrer"
			><Download /></a
		>
	</div>
	<Table.Root>
		<Table.Caption>Table 2. Partition function</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class={cell_padding}>Temperature (K)</Table.Head>
				<Table.Head class={cell_padding}>Q</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each qpart_arr as [key, value]}
				<Table.Row>
					<Table.Cell class={cell_padding}>{key}</Table.Cell>
					<Table.Cell class={cell_padding}>{value}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
