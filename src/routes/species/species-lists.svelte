<script lang="ts">
	import { base } from '$app/paths';
	// import VirtualList from '@sveltejs/svelte-virtual-list';
	import * as Command from '$lib/components/ui/command';
	export let species: Species[] = [];
</script>

<Command.Root class="rounded-lg border shadow-md max-w-[450px]">
	<Command.Input placeholder="search..." />
	<Command.List class="p-4 gap-4 max-h-[70vh] overflow-auto">
		<Command.Empty>No results found.</Command.Empty>
		{#each species as sp}
			<!-- <VirtualList items={species} let:item={sp}> -->
			<!-- {#each Array(50) as _} -->
			<Command.Item value={sp.name_formula}>
				<a class="w-full" href="{base}/species/{sp.id}"
					>{#if sp.name_html}
						{@html sp.name_html}
					{:else}
						{sp.iupac_name ?? sp.name_formula}
					{/if}</a
				>
			</Command.Item>
			<!-- {/each} -->
			<!-- </VirtualList> -->
		{/each}
	</Command.List>
</Command.Root>

<!-- <div class="container__div w-full h-full">
	<form class="join w-full" method="GET" action="{base}/species">
		<input
			name="substruct"
			value=""
			class="w-full input input-bordered join-item"
			placeholder="Enter substructure in SMILES or SMARTS format"
		/>
		<button class="btn join-item rounded-r-full">Search</button>
	</form>
	{#if species.length > 0}
		<VirtualList items={species} let:item={sp}>
			<li class="text-xl">
				<a href="{base}/species/{sp.id}"
					>{#if sp.name_html}
						{@html sp.name_html}
					{:else}
						{sp.iupac_name || sp.name_formula}
					{/if}</a
				>
			</li>
		</VirtualList>
	{:else}
		<p>No species found</p>
	{/if}
</div>

<style>
	.container__div {
		display: grid;
		gap: 1rem;
		grid-template-rows: auto 1fr;
		overflow: hidden;
		align-items: baseline;
	}
</style> -->
