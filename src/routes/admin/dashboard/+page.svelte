<script lang="ts">
	import { logged_in, edit_mode } from '$lib/utils/stores';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';
	export let data: PageData;
	const { user } = data;
	// $: if (user?.name) logged_in.set(user.name);
</script>

{#if user}
	<div class="space-y-2">
		{#await data.fetch_ref_and_species(user.id)}
			<Loader fetching={true} />
		{:then value}
			{#if value}
				<div class="stats stats-horizontal shadow">
					<MetaRef meta_ref={value.MetaReference} />
					<MetaSpecies meta_species={value.SpeciesMetadata} />
				</div>
			{:else}
				<p>Nothing uploaded by {user.name}</p>
			{/if}
		{:catch error}
			<AlertBox {error} />
		{/await}
	</div>
{:else}
	<p>Invalid user</p>
{/if}
