<script lang="ts">
	import type { LayoutServerData } from '../$types';
	export let data: LayoutServerData;
</script>

<div class="grid gap-5">
	<div class="join w-full">
		<input
			class="w-full input input-bordered join-item"
			placeholder="Enter substructure of molecular species"
		/>
		<button class="btn join-item rounded-r-full">Search</button>
	</div>

	<div class="">
		{#each data.species as sp (sp.id)}
			<li class="text-xl">
				<a href="/species/{sp.id}"
					>{#if sp.name_html}
						{@html sp.name_html}
					{:else}
						{sp.iupac_name || sp.name_formula}
					{/if}</a
				>
			</li>
		{/each}
	</div>
</div>
