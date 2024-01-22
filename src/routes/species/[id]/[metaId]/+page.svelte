<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { AlertCircle, Download } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;
	const cell_padding = 'p-2';
</script>

{#await data.load}
	<div class="flex gap-2 items-center">
		<span class="loading loading-spinner"></span>
		<span>Fetching data please wait...</span>
	</div>
{:then { meta_references, references }}
	<Table.Root class="sm:w-full lg:max-w-2xl">
		<Table.Caption>Metadata reference</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="{cell_padding} w-[100px]"></Table.Head>
				{#each meta_references as metaref, ind (metaref.id)}
					<Table.Cell class="text-center {cell_padding}">Ref <sup>{ind + 1}</sup></Table.Cell>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class={cell_padding}>DOI/URL</Table.Cell>
				{#each references as ref (ref.id)}
					<Table.Cell class="text-center {cell_padding}">
						<Button variant="link">
							{#if ref.doi}
								<a href="https://doi.org/{ref.doi}" target="_blank">
									{ref.doi ?? '-'}
								</a>
							{:else if ref.ref_url}
								<a href={ref.ref_url} target="_blank">
									{`${ref.ref_url.slice(0, 15)}...` ?? '-'}
								</a>
							{/if}
						</Button>
					</Table.Cell>
				{/each}
			</Table.Row>

			<Table.Row>
				<Table.Cell class={cell_padding}>Bibtex file</Table.Cell>
				{#each references as ref (ref.id)}
					{@const bibfile = ref.bibtex.split('/').at(-1)}
					<Table.Cell class="text-center {cell_padding}">
						<a
							href="{base}/uploads/bib/{bibfile}"
							download
							target="_blank"
							class="flex justify-center hover:text-blue"><Download size="20" /></a
						>
					</Table.Cell>
				{/each}
			</Table.Row>

			<Table.Row>
				<Table.Cell class={cell_padding}>Ref. Notes</Table.Cell>
				{#each references as ref (ref.id)}
					<Table.Cell class="text-center {cell_padding}">{ref.notes ?? '-'}</Table.Cell>
				{/each}
			</Table.Row>

			<Table.Row>
				<Table.Cell class={cell_padding}>Dipole moment</Table.Cell>
				{#each meta_references as metaref (metaref.id)}
					<Table.Cell class="text-center {cell_padding}"
						>{metaref.dipole_moment ? '✅' : '❌'}</Table.Cell
					>
				{/each}
			</Table.Row>

			<Table.Row>
				<Table.Cell class={cell_padding}>Spectrum</Table.Cell>
				{#each meta_references as metaref (metaref.id)}
					<Table.Cell class="text-center {cell_padding}"
						>{metaref.spectrum ? '✅' : '❌'}</Table.Cell
					>
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
{:catch error}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{error?.message ?? error}</Alert.Description>
	</Alert.Root>
{/await}
