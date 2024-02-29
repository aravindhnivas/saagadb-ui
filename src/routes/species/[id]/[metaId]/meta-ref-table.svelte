<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Download } from 'lucide-svelte/icons';
	import Bibfile from './bibfile.svelte';
	import { base } from '$app/paths';

	export let meta_references: MetaReference[] = [];
	export let references: Reference[] = [];
	const cell_padding = 'p-2';
</script>

<Table.Root>
	<Table.Caption>Table 1. Metadata reference</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="{cell_padding} w-[100px]"></Table.Head>
			{#each meta_references as _, ind}
				<Table.Cell class="text-center {cell_padding}">Ref <sup>{ind + 1}</sup></Table.Cell>
			{/each}
		</Table.Row>
	</Table.Header>

	<Table.Body>
		<Table.Row>
			<Table.Cell class={cell_padding}>
				<a
					href="{base}/api/data/reference/bibtex/?bibtex_ids={references
						.map((r) => r.id)
						.join(',')}"
					class="flex gap-1 items-center"
					target="_blank"
					rel="noopener noreferrer"
					download
				>
					<span>Cite</span>
					<Download />
				</a>
			</Table.Cell>
			{#each references as ref}
				<Table.Cell class="text-center {cell_padding}">
					<Bibfile bibtex={ref.bibtex} />
				</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Ref. Notes</Table.Cell>
			{#each references as ref}
				<Table.Cell class="text-center {cell_padding}">{ref.notes ?? '-'}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Dipole moment</Table.Cell>
			{#each meta_references as metaref}
				<Table.Cell class="text-center {cell_padding}"
					>{metaref.dipole_moment ? '✅' : '❌'}</Table.Cell
				>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Spectrum</Table.Cell>
			{#each meta_references as metaref (metaref.id)}
				<Table.Cell class="text-center {cell_padding}">{metaref.spectrum ? '✅' : '❌'}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Notes</Table.Cell>
			{#each meta_references as metaref (metaref.id)}
				<Table.Cell class="text-center {cell_padding}">{metaref.notes ?? '-'}</Table.Cell>
			{/each}
		</Table.Row>
	</Table.Body>
</Table.Root>
