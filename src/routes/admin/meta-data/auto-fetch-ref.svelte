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
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import { tick } from 'svelte';

	export let submitting = false;

	const { form, message, posted } = getForm();

	let submitted_index: number | undefined = undefined;
	let fetching_doi = false;
	let citation = '';
	let render = false;
	// $: console.log({ $posted });

	const update_doi_obj = async () => {
		if (!active_obj) return;
		active_obj.type = $message.type;
		active_obj.status = $message.text;
		doi_collections = doi_collections; // trigger reactivity
		await tick();
		render = !render;
	};

	$: if (active_obj && submitted_index === active_obj?.index && $message) {
		update_doi_obj();
	}

	$: if (fetching_doi && doi_collections.length === ref_entries.length) {
		fetching_doi = false;
		if (doi_collections.length > 0) {
			active_obj = doi_collections[0];
			formUpadte(active_obj);
			localStorage.setItem('doi_collections', JSON.stringify(doi_collections));
		}
	}

	$: ref_entries = citation.split('\n').filter((r) => r.trim()) || [];
	let doi_collections: {
		index: number;
		query: string;
		doi: string;
		ref_url: string;
		bibtex: string;
		cite: string;
		type?: 'success' | 'error';
		status?: string;
	}[] = JSON.parse(localStorage.getItem('doi_collections') || '[]') || [];
	// }[] = [];

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

	let cancel_doi_fetching = false;
	const fetch_doi_collections = () => {
		if (!citation.trim()) {
			toast.error('Please enter the citation');
			return;
		}
		fetching_doi = true;
		doi_collections = [];

		ref_entries.forEach((query, index) => {
			window.CrossRef.works({ query }, async (err, obj) => {
				if (cancel_doi_fetching) return (fetching_doi = false);
				console.log('fetching', query);
				let doi: string = '';
				let ref_url: string = '';
				let bibtex: string = '';
				let cite: string = '';
				if (!err && obj?.[0]) {
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
	let show_submission_message = false;
	let active_obj: (typeof doi_collections)[number] | undefined = doi_collections[0];
</script>

<div class="grid gap-4 p-2 border-2 border-rounded-2 border-gray-300">
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
		</a>
	</span>

	<slot name="header" />
</div>

<AlertBox
	title="NOTE!"
	message="The fetched doi from Fetch-DOI function may very well be wrong. So please check reference_link once generated. If not correct enter doi manually in the field and auto-fill from DOI, and check again."
	variant="default"
/>

<div class="flex gap-4 items-center">
	<Button class="w-[250px]" disabled={fetching_doi} on:click={fetch_doi_collections}>
		<Loader fetching={fetching_doi} description="" />
		<span>
			Fetch-DOI

			{#if fetching_doi}
				({Number((doi_collections.length / ref_entries.length) * 100).toFixed(2)}%)
			{/if}
		</span>
	</Button>
	{#if fetching_doi}
		<Button class="w-[250px]" variant="destructive" on:click={() => (cancel_doi_fetching = true)}>
			Cancel
		</Button>
	{/if}
</div>

<Resizable.PaneGroup direction="horizontal" class="rounded-lg border h-full">
	<Resizable.Pane defaultSize={25}>
		<div class="l-pane flex flex-col gap-4 text-sm p-4">
			{#key render}
				{#each doi_collections as doi_obj (doi_obj.index)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="cursor-pointer hover:underline p-2 rounded-lg"
						class:bg-gray-200={active_obj?.index === doi_obj.index}
						class:bg-red-200={doi_obj.type === 'error'}
						class:bg-green-200={doi_obj.type === 'success'}
						on:click={() => {
							// doi_collections = doi_collections;
							active_obj = doi_obj;
							if (!active_obj) return;
							formUpadte(active_obj);
							show_submission_message = submitted_index === active_obj.index;
						}}
					>
						<span>{doi_obj.index + 1}: {doi_obj.query}</span>
					</div>
				{/each}
			{/key}
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={75}>
		<div class="r-pane flex flex-col gap-2 p-4">
			{#key render}
				{#if active_obj?.status}
					<AlertBox
						message={active_obj.status}
						variant={active_obj?.type === 'error' ? 'destructive' : 'default'}
						title={active_obj?.type === 'error' ? 'Error' : 'Success'}
					/>
				{/if}
			{/key}

			<slot {active_obj} />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<Card.Footer class="flex flex-col gap-4 justify-center">
	<Form.Button
		class="w-[150px] flex gap-4"
		disabled={submitting}
		on:click={() => {
			$message = undefined;
			$posted = false;
			submitted_index = active_obj?.index;
			show_submission_message = true;
		}}
	>
		<span>{submitting ? 'Uploading...' : 'Upload'}</span>
		{#if submitting}
			<span class="loading loading-spinner"></span>
		{/if}
	</Form.Button>
	{#if submitting}
		<span class="text-sm"
			>Uploading will take a few minutes depending on the size of the file
		</span>
	{/if}
</Card.Footer>

<style>
	.r-pane,
	.l-pane {
		overflow: auto;
		min-height: 500px;
		max-height: calc(50vh - 100px);
	}
</style>
