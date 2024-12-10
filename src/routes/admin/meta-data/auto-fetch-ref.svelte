<script lang="ts">
	import { doi_collections, active_obj, active_ind } from './stores';
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
	import { onMount, tick } from 'svelte';
	import { RefreshCcw } from 'lucide-svelte/icons';
	import { sleep } from '$lib/core';

	export let submitting = false;

	const { form, message, posted } = getForm();

	let submitted_index: number | undefined = undefined;
	let fetching_doi = false;

	let render = false;

	const update_doi_obj = async () => {
		if (!$active_obj) return;
		$doi_collections[$active_ind] = {
			...$active_obj,
			status: $message.text,
			type: $message.type
		};
		$doi_collections = $doi_collections; // trigger reactivity
		await tick();
		render = !render; // trigger reactivity

		if (
			$message.type === 'success' ||
			($message.type === 'error' &&
				$message.text.includes('This entry already exists in the database'))
		) {
			form.update((f) => {
				f.notes = '';
				f.dipole_moment = false;
				f.spectrum = false;
				return f;
			});
		}
	};

	$: if ($active_obj && submitted_index === $active_ind && $message) {
		update_doi_obj();
	}

	$: if (fetching_doi && $doi_collections.length === ref_entries.length) {
		fetching_doi = false;
		if ($doi_collections.length > 0) {
			$active_ind = 0;
			formupdate();
			// console.log({ $doi_collections });
			if (import.meta.env.DEV) {
				localStorage.setItem('citation', citation);
				localStorage.setItem('doi_collections', JSON.stringify($doi_collections));
			}
		}
	}

	let citation = '';
	$: ref_entries = citation.split('\n').filter((r) => r.trim()) || [];

	const formupdate = () => {
		if (!$active_obj) return;
		form.update((f) => {
			if (!$active_obj) return f;
			f.doi = $active_obj.doi;
			f.ref_url = $active_obj.ref_url;
			f.bibtex = $active_obj.bibtex;
			f.notes = $active_obj.notes;
			f.dipole_moment = $active_obj.dipole_moment;
			f.spectrum = $active_obj.spectrum;
			return f;
		});
	};

	const fetch_all_ref = (db: string, data: { references: string[] }) => {
		if (!data) return toast.error('No data found');
		citation = data.references?.join('\n');

		if (import.meta.env.DEV) {
			$doi_collections = JSON.parse(localStorage.getItem('doi_collections') || '[]');
		} else {
			$doi_collections = [];
		}
	};

	let cancel_doi_fetching = false;
	const fetch_doi_collections = async () => {
		if (!citation.trim()) {
			toast.error('Please enter the citation');
			return;
		}
		fetching_doi = true;
		$doi_collections = [];
		$active_ind = -1;

		// ref_entries.forEach((query, index) => {
		for (let index = 0; index < ref_entries.length; index++) {
			const query = ref_entries[index];
			console.time('fetching ref');
			// console.log(`${index} - fetching ref: `, query);
			window.CrossRef.works({ query }, async (err, obj) => {
				if (cancel_doi_fetching) return (fetching_doi = false);
				console.log(`${index} - CrossRef fetching`, query);
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
				const _obj = {
					index,
					doi,
					query,
					ref_url,
					bibtex,
					cite,
					dipole_moment: false,
					spectrum: false,
					notes: ''
				};
				$doi_collections = [...$doi_collections, { ..._obj }];
				$doi_collections.sort((a, b) => a.index - b.index);
			});
			await sleep(2000);
			await tick();
			// fetching_doi = false;
			console.timeEnd('fetching ref');
		}
		// });
	};

	onMount(() => {
		if (import.meta.env.DEV) {
			citation = localStorage.getItem('citation') || '';
			$doi_collections = JSON.parse(localStorage.getItem('doi_collections') || '[]') || [];
		}
	});
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
				({Number(($doi_collections.length / ref_entries.length) * 100).toFixed(2)}%)
				<span>{$doi_collections.length}</span>
				/
				<span>{ref_entries.length}</span>
			{/if}
		</span>
	</Button>
	{#if fetching_doi}
		<Button class="w-[250px]" variant="destructive" on:click={() => (cancel_doi_fetching = true)}>
			Cancel
		</Button>
	{/if}

	{#if $doi_collections.length > 0}
		<Button
			class="w-[250px] ml-auto"
			variant="outline"
			disabled={fetching_doi}
			on:click={(e) => {
				e.preventDefault();
				$doi_collections = $doi_collections.map((f) => {
					delete f.status;
					delete f.type;
					f.dipole_moment = false;
					f.spectrum = false;
					f.notes = '';
					return f;
				});
				// active_obj = $doi_collections[0];
				$active_ind = 0;
				$message = undefined;
				$posted = false;
				render = !render;
			}}
		>
			<div class="flex gap-4 items-center">
				<RefreshCcw />
				<span>Refresh</span>
			</div>
		</Button>
	{/if}
</div>

<Resizable.PaneGroup direction="horizontal" class="rounded-lg border h-full">
	<Resizable.Pane defaultSize={25}>
		<div class="l-pane flex flex-col gap-4 text-sm p-4">
			{#key render}
				{#each $doi_collections as doi_obj (doi_obj.index)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="cursor-pointer hover:underline p-2 rounded-lg"
						class:underline={$active_ind === doi_obj.index}
						class:bg-gray-200={$active_ind === doi_obj.index}
						class:bg-red-200={doi_obj.type === 'error'}
						class:bg-green-200={doi_obj.type === 'success'}
						on:click={() => {
							$active_ind = doi_obj.index;
							formupdate();
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
				{#if $active_obj?.status}
					<AlertBox
						class={$active_obj?.type === 'success' ? 'bg-green-200' : ''}
						message={$active_obj.status}
						variant={$active_obj?.type === 'error' ? 'destructive' : 'default'}
						title={$active_obj?.type === 'error' ? 'Error' : 'Success'}
					/>
				{/if}
				<slot />
			{/key}
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>

<Card.Footer class="flex flex-col gap-4 justify-center">
	<Form.Button
		class="w-[150px] flex gap-4"
		disabled={submitting}
		on:click={(e) => {
			if ($active_obj?.type === 'success') {
				e.preventDefault();
				toast.warning('Reference already added. Please select another one.');
			}
			$message = undefined;
			$posted = false;
			submitted_index = $active_ind;
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
