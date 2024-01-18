<script lang="ts">
	import type { PageData } from './[metaId]/$types';
	import MetaRef from './[metaId]/+page.svelte';
	import * as Dialog from '$lib/components/ui/dialog';

	export let data: PageData;
	export let species_name: string;
	export let meta_name: string;
	export let open: boolean = false;
</script>

<Dialog.Root
	bind:open
	onOpenChange={(state) => {
		history.back();
	}}
>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<Dialog.Title>{meta_name} (found {data.meta_references.length} references)</Dialog.Title>
			<Dialog.Description>
				<p>
					Reference and metadata for <em class="font-bold">{species_name}</em> from {meta_name}
					database
				</p>
			</Dialog.Description>
		</Dialog.Header>
		<div class="page-contents">
			<MetaRef {data} />
		</div>
	</Dialog.Content>
</Dialog.Root>

<style>
	.page-contents {
		overflow-y: auto;
		max-height: 60vh;
	}
</style>
