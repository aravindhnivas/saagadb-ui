<script lang="ts">
	import { AlertCircle, Download } from 'lucide-svelte/icons';
	import { Button } from '$lib/components/ui/button';
	import CopyButton from '$lib/components/copy-button.svelte';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { onMount } from 'svelte';
	// import { base } from '$app/paths';

	export let bib_url: string;
	let bibtex: string;

	onMount(async () => {
		// console.log('bib_url', bib_url);

		if (!bib_url) return;
		if (!bib_url.endsWith('.bib')) return;
		const res = await fetch(bib_url);
		bibtex = await res.text();
		// console.log('bibtex', bibtex);
	});
</script>

{#if bibtex}
	{#await fetch_bibfile({ bibtex })}
		<p>fetching...</p>
	{:then { citeas, href, tooltip, parsed, bibtex_download_href, citation_key }}
		<div class="flex gap-4 items-center justify-center">
			<Button variant="link">
				<a {href} target="_blank" rel="noopener noreferrer">
					<span aria-label={tooltip} data-cooltipz-dir="top">{citeas}</span>
				</a>
			</Button>
			<CopyButton text={parsed} />
			<a
				href={bibtex_download_href}
				download={`${citation_key}.bib`}
				target="_blank"
				rel="noopener noreferrer"><Download /></a
			>
		</div>
	{:catch error}
		<div class="flex gap-2 items-center justify-center text-error">
			<AlertCircle />
			<span>{error.message}</span>
		</div>
	{/await}
{/if}
