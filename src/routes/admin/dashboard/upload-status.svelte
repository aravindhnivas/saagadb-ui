<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import { BookMarked, Atom, ArrowBigLeft } from 'lucide-svelte/icons';
	import StatComponent from './stat-component.svelte';
	import { base } from '$app/paths';
	import { setContext } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	// console.log($page.url.pathname);
	export let user: User;
	export let fetch_upload_count: Promise<UploadCountResponse>;
	export let show_header = true;

	setContext('user', user);
</script>

<div class="grid gap-4 px-5">
	{#await fetch_upload_count}
		<Loader fetching={true} />
	{:then value}
		{#if value}
			{#if show_header}
				<Button
					variant="outline"
					class="w-[150px]"
					on:click={() => {
						history.back();
					}}
				>
					<ArrowBigLeft /> Go back
				</Button>
				<h1 class="text-2xl font-bold">Upload status for {user.name}</h1>
			{/if}
			<div class="stats stats-vertical shadow px-5">
				<StatComponent
					apiName="species"
					total={value.full.species}
					approved={value.approved.species}
				>
					<svelte:fragment slot="header">
						<Atom />
						<span>Species</span>
					</svelte:fragment>
				</StatComponent>
				<StatComponent
					apiName="species-metadata"
					total={value.full.species_metadata}
					approved={value.approved.species_metadata}
				>
					<svelte:fragment slot="header">
						<Atom />
						<span>Species-metadata</span>
					</svelte:fragment>
				</StatComponent>
				<StatComponent
					apiName="reference"
					total={value.full.reference}
					approved={value.approved.reference}
				>
					<svelte:fragment slot="header">
						<BookMarked />
						<span>Reference</span>
					</svelte:fragment>
				</StatComponent>
				<StatComponent
					apiName="meta-reference"
					total={value.full.meta_reference}
					approved={value.approved.meta_reference}
				>
					<svelte:fragment slot="header">
						<BookMarked />
						<span>Reference-metadata</span>
					</svelte:fragment>
				</StatComponent>
			</div>
		{:else}
			<p>Nothing uploaded by {user.name}</p>
		{/if}
	{:catch error}
		<AlertBox {error} />
	{/await}
</div>
