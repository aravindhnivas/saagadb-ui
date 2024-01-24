<script lang="ts">
	import type { PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import { AlertCircle, Copy, Download } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import Cite from 'citation-js';
	import type { Reference } from '$lib/schemas/reference';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	console.log(copy);
	const cell_padding = 'p-2';

	const fetch_bibfile = async (ref: Reference) => {
		const parsed_data = await Cite.async(ref.doi);
		const data = parsed_data.data[0];
		const { author, issued, URL } = data;
		const first_author = author.find((a) => a.sequence === 'first');
		const author_clean = first_author.family + (author.length > 1 ? ' et al.' : '');
		const year = issued['date-parts'][0][0];
		const citeas = `${author_clean} (${year})`;

		const tooltip = `${data['container-title']}`;
		const parsed = parsed_data.format('bibliography', {
			// format: 'html',
			template: 'harvard1',
			lang: 'en-US'
		});
		return { citeas, URL, tooltip, parsed };
	};
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
				<Table.Cell class={cell_padding}>Cite</Table.Cell>
				{#each references as ref (ref.id)}
					<Table.Cell class="text-center {cell_padding}">
						{#if ref.bibtex}
							{#await fetch_bibfile(ref) then { citeas, URL, tooltip, parsed }}
								<div class="flex gap-2 items-center">
									<Button variant="link">
										<a href={URL} target="_blank">
											<span aria-label={tooltip} data-cooltipz-dir="top">{citeas}</span>
										</a>
									</Button>
									<button
										use:copy={parsed}
										on:svelte-copy={(event) => {
											toast.success(`Copied to clipboard: ${event.detail}`);
										}}
										on:svelte-copy:error={(event) => {
											toast.error(`There was an error: ${event.detail.message}`);
										}}
										aria-label={'copy full reference to clipboard'}
										data-cooltipz-dir="top"
									>
										<Copy />
									</button>
								</div>
							{/await}
						{/if}
					</Table.Cell>
				{/each}
			</Table.Row>

			<Table.Row>
				<Table.Cell class={cell_padding}>Bibtex file</Table.Cell>
				{#each references as ref (ref.id)}
					<Table.Cell class="text-center {cell_padding}">
						<a
							href={ref.bibtex}
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
