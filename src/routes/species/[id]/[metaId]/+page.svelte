<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { DownloadCloud } from 'lucide-svelte';

	export let data: PageData;

	const metaref_keys = [
		{ name: 'Dipole moment', value: 'dipole_moment' },
		{ name: 'Spectrum', value: 'spectrum' },
		{ name: 'Notes', value: 'notes' }
	];

	const cell_padding = 'p-2';
</script>

<Table.Root class="sm:w-full lg:max-w-2xl">
	<Table.Caption>Metadata reference</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head class="{cell_padding} w-[100px]"></Table.Head>
			{#each data.meta_references as metaref (metaref.id)}
				<Table.Cell class="text-center {cell_padding}">Ref <sup>{metaref.ref}</sup></Table.Cell>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each metaref_keys as key}
			<Table.Row>
				<Table.Cell class={cell_padding}>{key.name}</Table.Cell>
				{#each data.meta_references as metaref (metaref.id)}
					<Table.Cell class="text-center {cell_padding}">{metaref[key.value] ?? '-'}</Table.Cell>
				{/each}
			</Table.Row>
		{/each}

		<!-- Ref DOI/URL -->
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

		<!-- Ref bibtex -->
		<Table.Row>
			<Table.Cell class={cell_padding}>Bibtex file</Table.Cell>
			{#each data.references as ref (ref.id)}
				<Table.Cell class="text-center {cell_padding}">
					<a href={ref.bibtex} download target="_blank" class="flex justify-center"
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
	</Table.Body>
</Table.Root>
