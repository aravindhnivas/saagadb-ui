<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { ArrowBigLeft } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	// import UploadStatus from '../../upload-status.svelte';
	import { base } from '$app/paths';
	import { setContext } from 'svelte';
	import ApprovalAccordian from '../../approval-accordian.svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';

	export let data: PageData;
	export let form: ActionData;

	// const { user, fetch_ref_and_species } = data;
	$: console.log({ data });
	$: console.log({ form });
	setContext('approve_btn', true);
	// $: setContext('form', form);
	$: if (form && form.success) toast.success(form.message);
	$: if (form && !form.success) toast.error(form.message);
</script>

<div class="grid gap-4 px-2">
	<a class="flex gap-4 btn btn-sm btn-dark w-[150px]" href="{base}/admin/dashboard"
		><ArrowBigLeft /> Go back</a
	>
	<h1 class="text-2xl font-bold">Pending approval for {data.user.name}</h1>
	{#await data.fetch_ref_and_species}
		<Loader fetching={true} />
	{:then value}
		{#if value}
			{@const meta_ref = value.MetaReference}
			{@const meta_species = value.SpeciesMetadata}
			<ApprovalAccordian {meta_ref} {meta_species} />
		{/if}
	{:catch error}
		<AlertBox {error} />
	{/await}
</div>
