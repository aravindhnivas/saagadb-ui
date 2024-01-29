<script lang="ts">
	import { AlertCircle, Download } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import CopyButton from '$lib/components/copy-button.svelte';
	import fetch_bibfile from '$lib/utils/bibfile';
	export let ref: Reference;
</script>

{#await fetch_bibfile({ doi: ref.doi, bibtex: ref.bibtex })}
	<p>fetching...</p>
{:then { citeas, href, tooltip, parsed, bibtex_download_href, citation_key }}
	<div class="flex gap-4 items-center justify-center">
		<Button variant="link">
			<a {href} target="_blank">
				<span aria-label={tooltip} data-cooltipz-dir="top">{citeas}</span>
			</a>
		</Button>
		<CopyButton text={parsed} />
		<a href={bibtex_download_href} download={`${citation_key}.bib`} target="_blank"><Download /></a>
	</div>
{:catch error}
	<div class="flex gap-2 items-center justify-center text-error">
		<AlertCircle />
		<span>{error.message}</span>
	</div>
{/await}
