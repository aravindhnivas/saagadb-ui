<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { Textarea } from '$lib/components/ui/textarea';
	import Loader from '$lib/components/utils/loader.svelte';
	import { toast } from 'svelte-sonner';
	import AutoFillName from '../auto-fill-name.svelte';

	let fetching_doi = false;
	let citation = '';

	$: if (fetching_doi && doi_collections.length === ref_entries.length) {
		fetching_doi = false;
		console.log({ doi_collections });
	}
	$: ref_entries = citation.split('\n').filter((r) => r.trim()) || [];
	// let ref_entries: string[] = [];
	let doi_collections: {
		query: string;
		doi: string;
		ref_url: string;
		bibtex: string;
		cite: string;
	}[] = [];
	const fetch_all_ref = (db: string, data: { references: string[] }) => {
		if (!data) return toast.error('No data found');
		// ref_entries = data.references || [];
		// ref_entries = [...ref_entries, 'asdsdads', 'dsadsads'];
		citation = data.references?.join('\n');
	};

	const fetch_doi_collections = () => {
		if (!citation.trim()) {
			toast.error('Please enter the citation');
			return;
		}
		fetching_doi = true;
		doi_collections = [];
		ref_entries.forEach((query) => {
			window.CrossRef.works({ query }, async (err, obj) => {
				let doi: string = '';
				let ref_url: string = '';
				let bibtex: string = '';
				let cite: string = '';
				if (!err && obj[0]) {
					doi = obj[0].DOI || null;
					if (doi) {
						const { bibtex_text, parsed } = await fetch_bibfile({ doi });

						ref_url = `https://doi.org/${doi}`;
						bibtex = bibtex_text;
						cite = parsed;
					}
				}
				doi_collections = [...doi_collections, { doi, query, ref_url, bibtex, cite }];
			});
		});
	};
</script>

<div class="grid gap-4 p-2 border-2 border-rounded-2 border-gray-300">
	<AutoFillName callback={fetch_all_ref} />

	<Label>DOI fetcher {ref_entries.length ? `(${ref_entries.length}) citations` : ''}</Label>
	<Textarea bind:value={citation} />

	<Button class="w-[250px]" disabled={fetching_doi} on:click={fetch_doi_collections}>
		<Loader fetching={fetching_doi} description="" />
		<span
			>Fetch-DOI

			{#if fetching_doi}
				({Number((doi_collections.length / ref_entries.length) * 100).toFixed(2)}%)
			{/if}
		</span>
	</Button>
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
{#if doi_collections.length > 0}
	<div class="grid gap-4 select-text">
		{#each doi_collections as item, i}
			<div
				class="grid gap-4 grid-flow-col"
				style="grid-template-columns: auto 1fr 1fr 3fr; grid-auto-flow: row;"
			>
				<span>{i + 1}</span>
				<span>{item.query}</span>
				<!-- <span>{item.doi}</span> -->
				<a
					href={item.ref_url}
					class="underline text-blue"
					target="_blank"
					rel="noopener noreferrer"
				>
					<!-- {item.ref_url} -->
					{item.doi}
				</a>

				<Textarea value={item.bibtex} placeholder="Bibtex" />
			</div>
			<span class="w-full text-xs text-gray-500 text-center">{item.cite}</span>
			<Separator />
		{/each}
	</div>
	<Separator />
{/if}
