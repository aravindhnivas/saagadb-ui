<script lang="ts">
	import { base } from '$app/paths';
	import { logged_in, edit_mode } from '$lib/utils/stores';
	import type { PageData } from './$types';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import MetaRef from './meta-ref.svelte';
	import MetaSpecies from './meta-species.svelte';
	import { ShieldCheck } from 'lucide-svelte';
	export let data: PageData;
	const { user } = data;
	$: if (user?.name) logged_in.set(user.name);

	console.log({ user });
</script>

{#if user}
	<div class="alert">
		<ShieldCheck />
		{#await fetch(`${base}/api/user/fetch/${user.approver}`) then value}
			{#await value.json() then { name, email }}
				<span>Approver: {name} ({email})</span>
			{/await}
		{/await}
	</div>

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
