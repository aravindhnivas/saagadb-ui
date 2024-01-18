<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { DownloadCloud } from 'lucide-svelte';

	export let data: PageData;
	const cell_padding = 'p-2';
</script>

<Table.Root class="sm:w-full lg:max-w-2xl">
	<Table.Caption>Metadata reference</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="{cell_padding} w-[100px]"></Table.Head>
			{#each data.meta_references as metaref, ind (metaref.id)}
				<Table.Cell class="text-center {cell_padding}">Ref <sup>{ind + 1}</sup></Table.Cell>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row>
			<Table.Cell class={cell_padding}>DOI/URL</Table.Cell>
			{#each data.references as ref (ref.id)}
				<Table.Cell class="text-center {cell_padding}">
					{#if ref.doi}
						<a href="https://doi.org/{ref.doi}" target="_blank">
							<em class="underline hover:text-blue">{ref.doi ?? '-'}</em>
						</a>
					{:else if ref.ref_url}
						<a href={ref.ref_url} target="_blank">
							<em class="underline hover:text-blue">{`${ref.ref_url.slice(0, 15)}...` ?? '-'}</em>
						</a>
					{/if}
				</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Bibtex file</Table.Cell>
			{#each data.references as ref (ref.id)}
				{@const bibfile = ref.bibtex.split('/').at(-1)}
				<Table.Cell class="text-center {cell_padding}">
					<a href="/uploads/bib/{bibfile}" download target="_blank" class="flex justify-center"
						><DownloadCloud size="20" /></a
					>
				</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Ref. Notes</Table.Cell>
			{#each data.references as ref (ref.id)}
				<Table.Cell class="text-center {cell_padding}">{ref.notes ?? '-'}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Dipole moment</Table.Cell>
			{#each data.meta_references as metaref (metaref.id)}
				<Table.Cell class="text-center {cell_padding}"
					>{metaref.dipole_moment ? '✅' : '❌'}</Table.Cell
				>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Spectrum</Table.Cell>
			{#each data.meta_references as metaref (metaref.id)}
				<Table.Cell class="text-center {cell_padding}">{metaref.spectrum ? '✅' : '❌'}</Table.Cell>
			{/each}
		</Table.Row>

		<Table.Row>
			<Table.Cell class={cell_padding}>Notes</Table.Cell>
			{#each data.meta_references as metaref (metaref.id)}
				<Table.Cell class="text-center {cell_padding}">{metaref.notes ?? '-'}</Table.Cell>
			{/each}
		</Table.Row>
	</Table.Body>
</Table.Root>
