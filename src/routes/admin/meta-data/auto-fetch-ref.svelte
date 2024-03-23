<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { Textarea } from '$lib/components/ui/textarea';
	import Loader from '$lib/components/utils/loader.svelte';
	import { toast } from 'svelte-sonner';
	import AutoFillName from '../auto-fill-name.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	import { getForm } from 'formsnap';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { oO } from '@zmotivat0r/o0';

	const { form, message } = getForm();

	let submitted_index: number | undefined = undefined;
	$: if ($message) {
		submitted_index = active_obj?.index;
	}

	$: console.log(submitted_index, $message);

	let fetching_doi = false;
	let citation = '';

	$: if (fetching_doi && doi_collections.length === ref_entries.length) {
		fetching_doi = false;
		if (doi_collections.length > 0) {
			active_obj = doi_collections[0];
			formUpadte(active_obj);
		}
		// console.log({ doi_collections });
	}

	$: ref_entries = citation.split('\n').filter((r) => r.trim()) || [];
	let doi_collections: {
		index: number;
		query: string;
		doi: string;
		ref_url: string;
		bibtex: string;
		cite: string;
	}[] = [];

	const formUpadte = (obj: (typeof doi_collections)[number]) => {
		if (!obj) return;
		form.update((f) => {
			f.doi = obj.doi;
			f.ref_url = obj.ref_url;
			f.bibtex = obj.bibtex;
			return f;
		});
	};

	const fetch_all_ref = (db: string, data: { references: string[] }) => {
		if (!data) return toast.error('No data found');
		citation = data.references?.join('\n');
		doi_collections = [];
	};

	const fetch_doi_collections = () => {
		if (!citation.trim()) {
			toast.error('Please enter the citation');
			return;
		}
		fetching_doi = true;
		doi_collections = [];

		ref_entries.forEach((query, index) => {
			window.CrossRef.works({ query }, async (err, obj) => {
				let doi: string = '';
				let ref_url: string = '';
				let bibtex: string = '';
				let cite: string = '';
				if (!err && obj[0]) {
					doi = obj[0].DOI || null;
					if (doi) {
						const [_, result] = await oO(fetch_bibfile({ doi }));
						if (result) {
							const { bibtex_text, parsed } = result;
							ref_url = `https://doi.org/${doi}`;
							bibtex = bibtex_text;
							cite = parsed;
						}
					}
				}

				doi_collections = [...doi_collections, { index, doi, query, ref_url, bibtex, cite }];
				doi_collections.sort((a, b) => a.index - b.index);
			});
		});
	};

	let active_obj: (typeof doi_collections)[number] | undefined = doi_collections[0];
	// let active_index: number = 0;
</script>

<div class="grid gap-4 p-2 border-2 border-rounded-2 border-gray-300">
	<slot name="header" />

	<AutoFillName callback={fetch_all_ref} />
	<Label>DOI fetcher {ref_entries.length ? `(${ref_entries.length}) citations` : ''}</Label>
	<Textarea bind:value={citation} />

	<span class="text-xs text-gray-500"
		>Use description such as <em
			>M. Tonooka, S. Yamamoto, K. Kobayashi, and S. Saito, 1997, J. Chem. Phys. 106, 2563.</em
		>
		to search citations using
		<a
			href="https://github.com/scienceai/crossref"
			target="_blank"
			rel="noopener noreferrer"
			class="underline"
		>
			Crossref API
		</a></span
	>
</div>

<AlertBox
	title="NOTE!"
	message="The fetched doi from Fetch-DOI function may very well be wrong. So please check reference_link once generated. If not correct enter doi manually in the field and auto-fill from DOI, and check again."
	variant="default"
/>

<Button class="w-[250px]" disabled={fetching_doi} on:click={fetch_doi_collections}>
	<Loader fetching={fetching_doi} description="" />
	<span
		>Fetch-DOI

		{#if fetching_doi}
			({Number((doi_collections.length / ref_entries.length) * 100).toFixed(2)}%)
		{/if}
	</span>
</Button>

<Resizable.PaneGroup direction="horizontal" class="rounded-lg border h-full">
	<Resizable.Pane defaultSize={25}>
		<div class="l-pane flex flex-col gap-4 text-sm p-4">
			<!-- <ul class="menu p-4 gap-4"> -->
			{#each doi_collections as { query }, index}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="cursor-pointer hover:underline p-2 rounded-lg {active_obj?.index === index
						? 'bg-gray-200'
						: ''}"
					class:bg-red-200={submitted_index === index && $message?.type !== 'success'}
					class:bg-green-200={submitted_index === index && $message?.type === 'success'}
					on:click={() => {
						active_obj = doi_collections.find((d) => d.query === query);
						if (!active_obj) return;
						formUpadte(active_obj);
					}}
				>
					<span>{index + 1}: {query}</span>
				</div>
			{/each}
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={75}>
		<div class="r-pane flex flex-col gap-2 p-4">
			<slot {active_obj} />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<style>
	.r-pane,
	.l-pane {
		overflow: auto;
		min-height: 500px;
		max-height: calc(100vh - 10px);
	}
</style>
