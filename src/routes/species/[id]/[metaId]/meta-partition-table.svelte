<script lang="ts">
	import * as Table from '$lib/components/ui/table';

	export let meta = [];
	export let id = '';
	const current_meta = meta.find((m) => m.id == id);
	const { partition_function } = current_meta ?? {};
	const cell_padding = 'p-2';
</script>

{#if partition_function}
	<Table.Root class="sm:w-full lg:max-w-2xl">
		<Table.Caption>Table 2. Partition function</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class={cell_padding}>Temperature</Table.Head>
				<Table.Head class={cell_padding}>Q</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each Object.entries(partition_function) as [key, value]}
				<Table.Row>
					<Table.Cell class={cell_padding}>{key}</Table.Cell>
					<Table.Cell class={cell_padding}>{value}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
