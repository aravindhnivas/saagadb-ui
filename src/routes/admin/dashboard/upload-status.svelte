<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import { BookMarked, Atom, ArrowBigLeft } from 'lucide-svelte/icons';
	import StatComponent from './stat-component.svelte';
	import { base } from '$app/paths';

	export let user: User;
	export let fetch_upload_count: Promise<UploadCountResponse>;
	export let show_header = true;
</script>

<div class="grid gap-4 animate__animated animate__fadeIn">
	{#await fetch_upload_count}
		<Loader fetching={true} />
	{:then value}
		{#if value}
			{#if show_header}
				<a class="flex gap-4 btn btn-sm btn-dark w-[150px]" href="{base}/admin/users"
					><ArrowBigLeft /> Go back</a
				>
				<h1 class="text-2xl font-bold">Upload status for {user.name}</h1>
			{/if}
			<div class="stats stats-vertical shadow">
				<StatComponent total={value.full.species} approved={value.approved.species}>
					<svelte:fragment slot="header">
						<Atom />
						<span>Species</span>
					</svelte:fragment>
				</StatComponent>
				<StatComponent
					total={value.full.species_metadata}
					approved={value.approved.species_metadata}
				>
					<svelte:fragment slot="header">
						<Atom />
						<span>Species-metadata</span>
					</svelte:fragment>
				</StatComponent>
				<StatComponent total={value.full.reference} approved={value.approved.reference}>
					<svelte:fragment slot="header">
						<BookMarked />
						<span>Reference</span>
					</svelte:fragment>
				</StatComponent>
				<StatComponent total={value.full.meta_reference} approved={value.approved.meta_reference}>
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
