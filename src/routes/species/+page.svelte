<script lang="ts">
	import type { PageServerData } from '../$types';
	export let data: PageServerData;
</script>

<!-- <div class="join w-full">
	<input class="input input-bordered join-item" placeholder="Email" />
	<button class="btn join-item rounded-r-full">Subscribe</button>
</div> -->

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
