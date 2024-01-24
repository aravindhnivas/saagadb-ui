<script lang="ts">
	import { edit_mode } from '$lib/utils/stores';
	import type { LayoutData } from './$types';
	import type { PageData as MetaPageData } from './[metaId]/$types';
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MetaPage from './meta-page.svelte';
	import { Button } from '$lib/components/ui/button';
	import { AlertCircle, ArrowBigLeft, HelpCircle, Terminal } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { base } from '$app/paths';
	import * as MolDraw from 'smiles-drawer';

	export let data: LayoutData;
	// console.log(MolDraw);
	// window.MolDraw = MolDraw;
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

	const chemdraw = (node: HTMLCanvasElement, smiles: string) => {
		console.log({ node, smiles, id: node.id, MolDraw });
		let moleculeOptions = {};
		let reactionOptions = {};

		const sd = new MolDraw.SmiDrawer(moleculeOptions, reactionOptions);
		sd.draw(
			smiles,
			node.id,
			'light',
			function (result) {
				console.log({ result });
			},
			function (err) {
				console.log({ err });
			}
		);
		console.log({ sd });
		return '';
	};

	onMount(() => {
		if (!$edit_mode) return;
		metadata_keys = [{ name: 'meta_id', value: 'id' }, ...metadata_keys];
	});

	let open_meta_ref = false;
	let meta_page_data: MetaPageData;

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
	let meta_name: string;
	const cell_padding = 'p-0.5';
</script>

<div class="grid gap-5 content-start overflow-hidden">
	<Button class="flex items-center w-[200px]" variant="outline">
		<a href="{base}/species" class="w-full flex gap-2 items-center justify-center"
			><ArrowBigLeft /><span>Go back</span></a
		>
	</Button>

	<div class="overflow-auto">
		{#await data.load_species_metadata}
			<div class="flex gap-2 items-center items-center">
				<span class="loading loading-spinner"></span>
				<span>Fetching data please wait...</span>
			</div>
		{:then { species, meta }}
			{#if species}
				<div class="grid grid-cols-2 gap-4 my-2">
					<div class="">
						<h1 class="text-xl font-300">
							{@html species.name_html}
							{$edit_mode ? `(id = ${species.id})` : ''}
						</h1>
						<h1 class="text-xl font-500">{species.iupac_name}</h1>
						<h2>{Number(species.molecular_mass).toFixed(2)} atomic mass</h2>
						<h2><em class="font-bold">SMILES: </em>{species.smiles}</h2>
						<h2><em class="font-bold">Standard InChI: </em>{species.standard_inchi}</h2>
						<h2><em class="font-bold">InChIkey: </em>{species.standard_inchi_key}</h2>
						<h2><em class="font-bold">SELFIES: </em>{species.selfies}</h2>
						<h2>{species.notes}</h2>
					</div>
					<canvas use:chemdraw={species.smiles} id="mol-canvas" width="500" height="500"></canvas>
					<!-- <div class="chem_drawing">
						{@html get_mol_structure_from_smi(species.smiles)}
					</div> -->
				</div>
			{:else}
				<p>No species found</p>
			{/if}

			{#if species && meta.length > 0}
				<Table.Root class="lg:w-2xl sm:w-full ">
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
								{@const key = data.linelist?.find((f) => f.id === metadata.linelist)?.linelist_name}
								<Table.Head class="text-center font-bold">
									<a
										href="{base}/species/{species.id}/{metadata.id}"
										on:click={(e) => {
											if (key) meta_name = key.toLocaleUpperCase();
											nav_to_ref(e);
										}}
									>
										<span class="underline hover:text-blue">{key?.toLocaleUpperCase()}</span>
									</a>
								</Table.Head>
							{/each}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each metadata_keys as key}
							<Table.Row>
								<Table.Cell class={cell_padding}>{@html key.name}</Table.Cell>
								{#each meta as metadata (metadata.id)}
									{@const val = metadata[key.value]}
									<Table.Cell class="text-center {cell_padding}">
										{#if typeof val === 'boolean' || ['true', 'false'].includes(val)}
											{val === 'true' ? '✅' : '❌'}
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
		{:catch error}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description>{error?.message ?? error}</Alert.Description>
			</Alert.Root>
		{/await}
	</div>
</div>
