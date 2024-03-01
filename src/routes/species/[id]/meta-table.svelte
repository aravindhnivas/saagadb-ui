<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Download, HelpCircle } from 'lucide-svelte/icons';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { edit_mode } from '$lib/utils/stores';
	import type { PageData as MetaPageData } from './[metaId]/$types';
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MetaPage from './meta-page.svelte';

	export let species_metadata: SpeciesMetadata[] = [];

	const { species: species_id, species_name } = species_metadata[0] ?? {};
	// $: console.log({ species_metadata });

	type MetadataKey = {
		name: string;
		value: keyof SpeciesMetadata;
		formatter?: (val: string) => string;
	}[];
	let metadata_keys: MetadataKey = [
		{ name: 'Category', value: 'category' },
		{ name: 'Molecule tag', value: 'molecule_tag' },
		{
			name: 'A / MHz',
			value: 'a_const',
			formatter: (val: string) => (val ? Number(val).toFixed(3) : '-')
		},
		{
			name: 'B / MHz',
			value: 'b_const',
			formatter: (val: string) => (val ? Number(val).toFixed(3) : '-')
		},
		{
			name: 'C / MHz',
			value: 'c_const',
			formatter: (val: string) => (val ? Number(val).toFixed(3) : '-')
		},
		{
			name: 'μ<sub>a</sub> / D',
			value: 'mu_a',
			formatter: (val: string) => (val ? Number(val).toFixed(3) : '-')
		},
		{
			name: 'μ<sub>b</sub> / D',
			value: 'mu_b',
			formatter: (val: string) => (val ? Number(val).toFixed(3) : '-')
		},
		{
			name: 'μ<sub>c</sub> / D',
			value: 'mu_c',
			formatter: (val: string) => (val ? Number(val).toFixed(3) : '-')
		},
		{ name: 'Hyperfine', value: 'hyperfine' },
		{ name: 'Degree of freedom', value: 'degree_of_freedom' },
		{ name: 'cat file', value: 'cat_file' },
		{ name: 'int file', value: 'int_file' },
		{ name: 'var file', value: 'var_file' },
		{ name: 'lin file', value: 'lin_file' },
		{ name: 'fit file', value: 'fit_file' },
		{ name: 'qpart file', value: 'qpart_file' },
		{ name: 'Date added', value: 'data_date' },
		{ name: 'Contributors', value: 'data_contributor' },
		{ name: 'Notes', value: 'notes' }
	];

	onMount(() => {
		if ($edit_mode) {
			metadata_keys = [{ name: 'meta_id', value: 'id' }, ...metadata_keys];
		}
	});

	const cell_padding = 'p-0.5';
	let open_meta_ref = false;
	let meta_page_data: MetaPageData;
	let meta_name: string;

	const nav_to_ref = async (e: MouseEvent) => {
		// bail if opening a new tab, or we're on too small a screen
		if (e.metaKey || innerWidth < 640) return;

		// prevent navigation
		e.preventDefault();

		const { href } = e.currentTarget as HTMLAnchorElement;

		// run `load` functions (or rather, get the result of the `load` functions
		// that are already running because of `data-sveltekit-preload-data`)
		const result = await preloadData(href);
		// console.log({ result });
		if (result.type === 'loaded' && result.status === 200) {
			meta_page_data = result.data as MetaPageData;
			pushState(href, { ready: true });
			open_meta_ref = true;
		} else {
			// something bad happened! try navigating
			goto(href);
		}
	};
	const fetch_from_database = (tag: number | string, database: string) => {
		if (!tag) return;
		const tag_val = tag.toString().padStart(6, '0');

		if (database === 'CDMS') {
			const url = 'https://cdms.astro.uni-koeln.de/cgi-bin';
			const fileinfo = `${url}/cdmsinfo?file=e${tag_val}.cat`;
			return { fileinfo, tag_val };
		} else if (database === 'JPL') {
			const url = 'https://spec.jpl.nasa.gov/ftp/pub/catalog/doc';
			const fileinfo = `${url}/d${tag_val}.pdf`;
			return { fileinfo, tag_val };
		}
	};
</script>

{#if species_metadata.length > 0}
	<Table.Root class="max-w-4xl">
		<Table.Caption>Species-metadata</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head class="flex items-center gap-2 {cell_padding}"
					><span>Database</span>
					<span
						aria-label="Click on the database name to get more metadata such as references, bibtex file, spectrum informations, etc."
						data-cooltipz-dir="down"
					>
						<HelpCircle />
					</span>
				</Table.Head>
				{#each species_metadata as { id, linelist_name } (id)}
					<Table.Head class="text-center font-bold">
						<a
							href="{base}/species/{species_id}/{id}"
							on:click={(e) => {
								if (linelist_name) meta_name = linelist_name;
								nav_to_ref(e);
							}}
						>
							<span class="underline hover:text-blue">{linelist_name.toUpperCase()}</span>
						</a>
					</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each metadata_keys as key}
				<Table.Row>
					<Table.Cell class={cell_padding}>{@html key.name}</Table.Cell>
					{#each species_metadata as metadata (metadata.id)}
						{@const val = metadata[key.value]}
						{@const linelist_name = metadata.linelist_name.toLocaleUpperCase()}
						<Table.Cell class="text-center {cell_padding}">
							{#if typeof val === 'boolean'}
								{val ? '✅' : '❌'}
							{:else if key.value === 'molecule_tag' && typeof val !== 'object'}
								{@const info = fetch_from_database(val, linelist_name)}
								<a
									class="underline hover:text-blue"
									href={info?.fileinfo}
									target="_blank"
									rel="noopener noreferrer"
									>{info?.tag_val ?? val}
								</a>
							{:else if key.value.endsWith('_file') && metadata?.[key.value]}
								{@const file = metadata[key.value].split('/').at(-1)}
								{@const ext = file.split('.').at(-1)}
								{@const filename = `${linelist_name}_${metadata.species_formula}_${metadata.molecule_tag}.${ext}`}
								<a
									class="btn btn-sm w-[150px]"
									href="{base}/uploads/sp/{file}"
									download={filename}
									target="_blank"
									rel="noopener noreferrer"
								>
									<div class="flex gap-4 items-center justify-evenly">
										<span>.{ext}</span>
										<Download />
									</div>
								</a>
							{:else}
								{key.formatter ? key.formatter(val) : val ?? '-'}
							{/if}
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<p>No metadata found</p>
{/if}

{#if $page.state.ready}
	<MetaPage bind:open={open_meta_ref} data={meta_page_data} {meta_name} {species_name} />
{/if}
