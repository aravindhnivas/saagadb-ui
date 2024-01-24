<script lang="ts">
	import { AlertCircle, Download } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import Cite from 'citation-js';
	import type { Reference } from '$lib/schemas/reference';
	import CopyButton from '$lib/components/copy-button.svelte';

	export let ref: Reference;

	const fetch_bibfile = async (ref: Reference) => {
		const parsed_data = await Cite.async(ref.doi);
		const data = parsed_data.data[0];

		// console.log(parsed_data);
		const { author, issued, URL: href } = data;

		const first_author = author.find((a) => a.sequence === 'first');
		const author_clean = first_author.family + (author.length > 1 ? ' et al.' : '');
		const year = issued['date-parts'][0][0];
		const citeas = `${author_clean} (${year})`;

		const tooltip = `${data['container-title']}`;
		const parsed = parsed_data.format('bibliography', {
			format: 'text',
			template: 'apa',
			lang: 'en-US'
		});

		const bibtex_text = parsed_data.format('bibtex');
		const citation_key = bibtex_text.match(/@article\{(.+),/)[1];
		const blob = new Blob([bibtex_text], { type: 'text/plain' });
		const bibtex_download_href = URL.createObjectURL(blob);

		return { citeas, href, tooltip, parsed, bibtex_download_href, citation_key };
	};
</script>

{#await fetch_bibfile(ref)}
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
