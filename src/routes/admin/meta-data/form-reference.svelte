<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { oO } from '@zmotivat0r/o0';
	import FormField from '$lib/components/forms/form-field.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import AutoFillName from '../auto-fill-name.svelte';
	// import CrossRef from 'crossref';

	export let form: SuperValidated<(typeof Schemas)['reference']>;

	// console.log({ CrossRef });
	const value = 'reference';
	const schema = Schemas[value];
	let fetching = false;
	let parsed_bibtex = '';
	let citation = '';
	let fetching_doi = false;

	$: if (fetching_doi && doi_collections.length === ref_entries.length) {
		fetching_doi = false;
		console.log({ doi_collections });
	}
	$: console.log({ doi_collections });
	// let auto_fill_doi_button: HTMLButtonElement;
	let ref_entries: string[] = [];
	let doi_collections: { query: string; doi: string | null }[] = [];
	const fetch_all_ref = (db: string, data: { references: string[] }) => {
		// console.log({ db, data });
		// if (db !== 'CDMS') return toast.error('Only CDMS references are supported');
		if (!data) return toast.error('No data found');
		ref_entries = data.references || [];
		citation = ref_entries?.join('\n');
	};
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	let:formStore
	let:formValues
	title="Reference"
	description="Please enter the details of the reference. DOI is required to auto-fill the form. If you have the bibtex file, you can upload it."
>
	<div class="grid gap-4 p-2 border-2 border-rounded-2 border-gray-300">
		<AutoFillName callback={fetch_all_ref} />

		<Label>DOI fetcher</Label>
		<div class="grid grid-cols-4 gap-4 items-center">
			<Textarea class="col-span-3" bind:value={citation} />
			<Button
				class="w-[250px]"
				disabled={fetching_doi}
				on:click={() => {
					if (!citation.trim()) {
						toast.error('Please enter the citation');
						return;
					}
					const citations_list = citation.split('\n').filter((c) => c.trim());
					// console.log({ citations_list });
					// return;
					fetching_doi = true;
					console.time('crossref');
					doi_collections = [];
					ref_entries.forEach((query) => {
						// doi_collections = [...doi_collections, { query, doi: null }];
						window.CrossRef.works({ query: citations_list[0] }, (err, obj) => {
							if (!err && obj[0]) {
								const doi = obj[0].DOI || null;
								doi_collections = [...doi_collections, { doi, query }];
							} else {
								doi_collections = [...doi_collections, { doi: null, query }];
							}
						});
					});
					// console.log({ doi_collections });
					// fetching_doi = false;
					// window.CrossRef.works({ query: citations_list[0] }, (err, obj) => {
					// 	if (err) {
					// 		fetching_doi = false;
					// 		toast.error(err);
					// 		return;
					// 	}
					// 	console.timeEnd('crossref');
					// 	fetching_doi = false;
					// 	if (!obj[0]) {
					// 		toast.error('DOI not found');
					// 		return;
					// 	}
					// 	const doi = obj[0].DOI;
					// 	// const url = obj[0].URL;
					// 	// console.log({ doi, url });
					// 	if (!doi) {
					// 		toast.error('DOI not found');
					// 		return;
					// 	}

					// 	const auto_fill_doi_button = document.getElementById('auto_fill_doi_button');
					// 	// console.log(auto_fill_doi_button);

					// 	formStore.update((f) => {
					// 		f.doi = doi;
					// 		auto_fill_doi_button?.click();
					// 		return f;
					// 	});
					// });
				}}
			>
				<Loader fetching={fetching_doi} description="" />
				<span
					>Fetch-DOI

					{#if fetching_doi}
						({(doi_collections.length / ref_entries.length) * 100}%)
					{/if}
				</span>
			</Button>
		</div>
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

	<FormField {config} name="doi" />
	<Button
		id="auto_fill_doi_button"
		variant="outline"
		on:click={async () => {
			try {
				fetching = true;
				formStore.update((f) => {
					f.doi = f.doi.trim();
					return f;
				});

				if (formValues.doi.includes('doi.org')) {
					const corr_doi = formValues.doi.split('doi.org/')[1];
					formStore.update((f) => {
						f.doi = corr_doi;
						return f;
					});
				}
				const doi = formValues.doi;
				if (!doi) throw new Error('DOI is required');
				const { href, bibtex_text, parsed } = await fetch_bibfile({ doi });
				parsed_bibtex = parsed;
				formStore.update((f) => {
					f.ref_url = href.replace('http://dx.doi.org/', 'https://doi.org/');
					f.bibtex = bibtex_text;
					return f;
				});
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				fetching = false;
			}
		}}>Auto-fill from DOI</Button
	>
	<Loader {fetching} />
	<FormField {config} name="ref_url" />

	{#if formValues.ref_url}
		<a href={formValues.ref_url} target="_blank" rel="noopener noreferrer" class="underline">
			Check reference link
		</a>
	{/if}

	<FormField {config} name="notes" textarea />

	<div class="flex gap-4 w-full items-baseline">
		<Form.Field {config} name="bibtex" let:constraints let:attrs>
			<Form.Item class="basis-3/4">
				<Form.Label>bibtex</Form.Label>
				<Form.Textarea {...constraints} {...attrs.input} />
				<Form.Validation {...attrs.validation} />
			</Form.Item>
		</Form.Field>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label>OR choose bibtex file</Label>
			<Input
				type="file"
				required={false}
				on:change={(e) => {
					const target = e.target;
					const file = target?.files?.[0];
					if (!file) return;
					const reader = new FileReader();
					reader.onload = async (e) => {
						const text = e.target?.result;
						formStore.update((f) => {
							f.bibtex = text;
							return f;
						});
					};
					reader.readAsText(file);
				}}
			/>
		</div>
	</div>

	{#if parsed_bibtex && formValues.bibtex}
		<AlertBox message={parsed_bibtex} variant="default" title="Fetched citation" />
		<button
			class="btn btn-sm"
			on:click={async (e) => {
				e.preventDefault();
				if (!formValues.doi) return;
				if (!formValues.bibtex) return;
				const [err, data] = await oO(fetch_bibfile({ bibtex: formValues.bibtex }));
				if (err instanceof Error) {
					console.error(err.stack);
					toast.error(err.message);
					return;
				}
				if (!data?.parsed) {
					toast.error('Failed to parse bibtex');
					return;
				}
				parsed_bibtex = data.parsed;
				toast.success('Bibtex parsed successfully');
			}}
			>Parse bibtex
		</button>
		<div class="alert text-sm p-1">
			Check the fetched citation and if needded make changes to the bibtex and then click on the
			"Parse bibtex" button.
		</div>
	{/if}
</FormTabContents>
