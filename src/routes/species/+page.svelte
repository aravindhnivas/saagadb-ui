<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<div class="grid gap-5">
	<form class="join w-full" method="GET" action="/species">
		<input
			name="substruct"
			value=""
			class="w-full input input-bordered join-item"
			placeholder="Enter substructure in SMILES or SMARTS format"
		/>
		<button class="btn join-item rounded-r-full">Search</button>
	</form>

	<div class="">
		{#if data.species?.length > 0}
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
		{:else}
			<p>No species found</p>
		{/if}
	</div>
</div>
