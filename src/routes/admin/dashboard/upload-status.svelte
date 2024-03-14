<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import { BookMarked, Atom, ArrowBigLeft } from 'lucide-svelte/icons';
	import StatComponent from './stat-component.svelte';
	import { setContext } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { base } from '$app/paths';

	export let user: User;
	export let fetch_upload_count: Promise<UploadCountResponse>;
	export let show_header = true;

	setContext('user', user);

	const filter_unapproved_counts = (
		unapproved_counts: UploadCountResponse['unapproved_counts']
	) => {
		console.log(unapproved_counts);
		return unapproved_counts.filter(
			(u) => u.id !== user.id && (u.species_metadata > 0 || u.meta_reference > 0)
		);
	};
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

			{#if user.is_staff}
				{@const unapproved_counts = filter_unapproved_counts(value.unapproved_counts)}
				{#if unapproved_counts.length > 0}
					<div class="card shadow-xl">
						<div class="card-body">
							<h2 class="card-title justify-center">The following users awaiting your approval</h2>
							<div class="grid grid-cols-6 gap-4 items-center select-text">
								{#each unapproved_counts as { id, name, species_metadata, meta_reference }}
									<a
										class="col-span-2 hover:underline"
										href="{base}/admin/dashboard/approve-data/{id}"
									>
										{name}
									</a>
									<span class="text-red col-span-2">{species_metadata} species-metadata</span>
									<span class="text-red col-span-2">{meta_reference} meta-reference</span>
								{/each}
							</div>
							<!-- <div class="card-actions justify-end">
						<button class="btn btn-primary">Buy Now</button>
					</div> -->
						</div>
					</div>
				{/if}
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
