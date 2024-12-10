<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ArrowBigLeft } from 'lucide-svelte/icons';
	import type { ActionData, PageData } from './$types';
	import ApprovalTab from './approval-tab.svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	export let form: ActionData;

	$: if (form && form.success) toast.success(form.message || 'Success');
	$: if (form && !form.success) toast.error(form.message || 'Error');
</script>

<div class="grid gap-4 px-2 mb-[100px]">
	<div class="flex gap-4">
		<Button
			variant="outline"
			class="w-[150px]"
			on:click={() => {
				history.back();
			}}
		>
			<ArrowBigLeft /> Go back
		</Button>
		<Button
			class="w-[200px] ml-auto"
			on:click={async () => {
				await invalidate('fetch:ref_and_species');
				toast.success('Data re-fetched');
			}}>Re-fetch data</Button
		>
	</div>

	<h1 class="text-2xl font-bold">Uploaded Species metadata and references by {data.user.name}</h1>

	{#await data.fetch_ref_and_species}
		<Loader fetching={true} />
	{:then value}
		{#if value}
			{@const meta_ref = value.MetaReference}
			{@const meta_species = value.SpeciesMetadata}
			<ApprovalTab {meta_ref} {meta_species} />
		{/if}
	{:catch error}
		<AlertBox {error} />
	{/await}
</div>
