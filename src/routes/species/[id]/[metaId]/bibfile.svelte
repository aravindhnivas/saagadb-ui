<script lang="ts">
	import { Copy } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import Cite from 'citation-js';
	import type { Reference } from '$lib/schemas/reference';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let ref: Reference;

	const fetch_bibfile = async (ref: Reference) => {
		const parsed_data = await Cite.async(ref.doi);
		const data = parsed_data.data[0];
		const { author, issued, URL } = data;
		const first_author = author.find((a) => a.sequence === 'first');
		const author_clean = first_author.family + (author.length > 1 ? ' et al.' : '');
		const year = issued['date-parts'][0][0];
		const citeas = `${author_clean} (${year})`;

		const tooltip = `${data['container-title']}`;
		const parsed = parsed_data.format('bibliography', {
			// format: 'html',
			template: 'harvard1',
			lang: 'en-US'
		});
		return { citeas, URL, tooltip, parsed };
	};
</script>

{#await fetch_bibfile(ref) then { citeas, URL, tooltip, parsed }}
	<div class="flex gap-2 items-center">
		<Button variant="link">
			<a href={URL} target="_blank">
				<span aria-label={tooltip} data-cooltipz-dir="top">{citeas}</span>
			</a>
		</Button>
		<button
			use:copy={parsed}
			on:svelte-copy={(event) => {
				toast.success(`Copied to clipboard: ${event.detail}`);
			}}
			on:svelte-copy:error={(event) => {
				toast.error(`There was an error: ${event.detail.message}`);
			}}
			aria-label={'copy full reference to clipboard'}
			data-cooltipz-dir="top"
		>
			<Copy />
		</button>
	</div>
{/await}
