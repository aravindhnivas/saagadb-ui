<script lang="ts">
	import type { PageData } from './$types';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { base } from '$app/paths';
	import VirtualList from '@sveltejs/svelte-virtual-list';

	export let data: PageData;
</script>

<form class="join w-full" method="GET" action="{base}/species">
	<input
		name="substruct"
		value=""
		class="w-full input input-bordered join-item"
		placeholder="Enter substructure in SMILES or SMARTS format"
	/>
	<button class="btn join-item rounded-r-full">Search</button>
</form>
{#await data.load}
	<div class="flex gap-2 items-center">
		<span class="loading loading-spinner"></span>
		<span>Fetching data please wait...</span>
	</div>
{:then { species }}
	<div class="">
		{#if species.length > 0}
			<!-- {#each species as sp (sp.id)} -->
			<VirtualList height="500px" items={species} let:item={sp}>
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
			<!-- {/each} -->
		{:else}
			<p>No species found</p>
		{/if}
	</div>
{:catch error}
	<Alert.Root variant="destructive">
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>Error</Alert.Title>
		<Alert.Description>{error?.message ?? error}</Alert.Description>
	</Alert.Root>
{/await}
