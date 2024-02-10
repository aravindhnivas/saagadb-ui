<script lang="ts">
	import { ArrowBigLeft } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';
	import UploadStatus from '../../upload-status.svelte';
	import { base } from '$app/paths';
	import { setContext } from 'svelte';

	export let data: PageData;
	export let form: ActionData;
	const { user, fetch_ref_and_species } = data;
	$: console.log({ data });
	$: console.log({ form });

	setContext('approve_btn', true);
</script>

<div class="grid gap-4 px-2">
	<a class="flex gap-4 btn btn-sm btn-dark w-[150px]" href="{base}/admin/dashboard"
		><ArrowBigLeft /> Go back</a
	>
	<UploadStatus {user} {fetch_ref_and_species} />
</div>
