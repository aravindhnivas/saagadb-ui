<script lang="ts">
	import { base } from '$app/paths';
	import * as Table from '$lib/components/ui/table';
	import { Download } from 'lucide-svelte/icons';

	export let meta: SpeciesMetadata[] = [];
	export let id: number = 0;
	const current_meta = meta.find((m) => m.id == id);
	// console.log({ current_meta });
	const { partition_function, qpart_file } = current_meta ?? {};
	// console.log({ qpart_file });
	const cell_padding = 'p-2';

	const sortedObj: Record<string, string> | undefined =
		partition_function &&
		Object.entries(partition_function)
			.sort(([aKey], [bKey]) => Number(bKey) - Number(aKey))
			.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
</script>

{#if current_meta && sortedObj}
	{@const { molecule_tag, linelist_name, species_formula } = current_meta}

	<div class="flex gap-4 items-center">
		<h1>Parition function</h1>
		<a
			href={qpart_file}
			download={`${species_formula}_${linelist_name}_${molecule_tag}.qpart`}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Download />
		</a>
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
			{#each Object.keys(sortedObj) as key}
				<Table.Row>
					<Table.Cell class={cell_padding}>{key}</Table.Cell>
					<Table.Cell class={cell_padding}>{sortedObj[key]}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
