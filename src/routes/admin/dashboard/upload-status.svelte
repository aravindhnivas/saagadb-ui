<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import { BookMarked, Atom } from 'lucide-svelte';
	import StatComponent from './stat-component.svelte';

	export let user: User;
	export let fetch_ref_and_species: Promise<{
		MetaReference: MetaReference[];
		SpeciesMetadata: SpeciesMetadata[];
	}>;
	export let show_header = true;
</script>

{#if user}
	<div class="grid gap-4 animate__animated animate__fadeIn">
		{#await fetch_ref_and_species}
			<Loader fetching={true} />
		{:then value}
			{#if value}
				{@const meta_ref = value.MetaReference}
				{@const meta_species = value.SpeciesMetadata}
				{#if show_header}
					<h1 class="text-2xl font-bold">Upload status for {user.name}</h1>
				{/if}
				<div class="stats stats-horizontal shadow">
					<StatComponent
						total={meta_species.length}
						approved={meta_species.filter((f) => f.approved).length}
					>
						<svelte:fragment slot="header">
							<Atom />
							<span>Species-metadata</span>
						</svelte:fragment>
					</StatComponent>
					<StatComponent
						total={meta_ref.length}
						approved={meta_ref.filter((f) => f.approved).length}
					>
						<svelte:fragment slot="header">
							<BookMarked />
							<span>Reference-metadata</span>
						</svelte:fragment>
					</StatComponent>
				</div>
				<!-- <ApprovalAccordian {meta_ref} {meta_species} /> -->
			{:else}
				<p>Nothing uploaded by {user.name}</p>
			{/if}
		{:catch error}
			<AlertBox {error} />
		{/await}
	</div>
{:else}
	<p>No user found</p>
{/if}
