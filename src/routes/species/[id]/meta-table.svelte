<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { HelpCircle } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { edit_mode } from '$lib/utils/stores';
	import type { PageData as MetaPageData } from './[metaId]/$types';
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MetaPage from './meta-page.svelte';

	export let species: Species;
	export let meta: SpeciesMetadata[] = [];
	export let linelist: Linelist[] = [];

	let metadata_keys = [
		{ name: 'Category', value: 'category' },
		{ name: 'Molecule tag', value: 'molecule_tag' },
		{ name: 'A <em>/ MHz</em>', value: 'a_const' },
		{ name: 'B <em>/ MHz</em>', value: 'b_const' },
		{ name: 'C <em>/ MHz</em>', value: 'c_const' },
		{ name: 'μ<sub>a</sub> <em>/ D</em>', value: 'mu_a' },
		{ name: 'μ<sub>b</sub> <em>/ D</em>', value: 'mu_b' },
		{ name: 'μ<sub>c</sub> <em>/ D</em>', value: 'mu_c' },
		{ name: 'Hyperfine', value: 'hyperfine' },
		{ name: 'Degree of freedom', value: 'degree_of_freedom' },
		{ name: 'Date added', value: 'data_date' },
		{ name: 'Contributors', value: 'data_contributor' },
		{ name: 'Notes', value: 'notes' }
	];

	onMount(() => {
		if (!$edit_mode) return;
		metadata_keys = [{ name: 'meta_id', value: 'id' }, ...metadata_keys];
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
	const fetch_from_database = (tag: number | string, database: 'CDMS' | 'JPL') => {
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

{#if species && meta.length > 0}
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
				{#each meta as metadata}
					{@const linelist_name = linelist
						?.find((f) => f.id === metadata.linelist)
						?.linelist_name?.toLocaleUpperCase()}
					{#if linelist_name}
						<Table.Head class="text-center font-bold">
							<a
								href="{base}/species/{species.id}/{metadata.id}"
								on:click={(e) => {
									if (linelist_name) meta_name = linelist_name;
									nav_to_ref(e);
								}}
							>
								<span class="underline hover:text-blue">{linelist_name}</span>
							</a>
						</Table.Head>
					{/if}
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each metadata_keys as key}
				<Table.Row>
					<Table.Cell class={cell_padding}>{@html key.name}</Table.Cell>
					{#each meta as metadata (metadata.id)}
						{@const linelist_name = linelist
							?.find((f) => f.id === metadata.linelist)
							?.linelist_name?.toLocaleUpperCase()}
						{@const val = metadata[key.value]}
						<Table.Cell class="text-center {cell_padding}">
							{#if typeof val === 'boolean' || ['true', 'false'].includes(val)}
								{val === 'true' ? '✅' : '❌'}
							{:else if key.value === 'molecule_tag'}
								{@const info = fetch_from_database(val, linelist_name)}
								<a class="underline hover:text-blue" href={info?.fileinfo} target="_blank"
									>{info?.tag_val ?? val}
								</a>
							{:else}
								{val ?? '-'}
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
	<MetaPage
		bind:open={open_meta_ref}
		data={meta_page_data}
		{meta_name}
		species_name={species.iupac_name}
	/>
{/if}
