<script lang="ts">
	import { base } from '$app/paths';
	// import VirtualList from '@sveltejs/svelte-virtual-list';
	import * as Command from '$lib/components/ui/command';
	export let species: Species[] = [];
	import { page } from '$app/stores';
</script>

<Command.Root class="rounded-lg border shadow-md max-w-[450px]">
	<Command.Input placeholder="search..." />
	<Command.List class="p-4 gap-4 max-h-[70vh] overflow-auto">
		<Command.Empty>No results found.</Command.Empty>
		{#each species as sp}
			{@const active = Number($page.params.id) === sp.id}
			<Command.Item value={sp.name_formula}>
				<a
					class="w-full {active ? 'border-black border-2 border-rounded px-2' : ''}"
					href="{base}/species/{sp.id}"
					>{#if sp.name_html}
						{@html sp.name_html}
					{:else}
						{sp.iupac_name ?? sp.name_formula}
					{/if}</a
				>
			</Command.Item>
		{/each}
	</Command.List>
</Command.Root>
