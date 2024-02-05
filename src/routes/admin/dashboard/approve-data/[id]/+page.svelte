<script lang="ts">
	import { ArrowBigLeft } from 'lucide-svelte';
	import type { PageData } from './$types';
	import UploadStatus from '../../upload-status.svelte';
	import { base } from '$app/paths';
	export let data: PageData;
</script>

<div class="grid gap-4">
	<a class="flex gap-4 btn btn-sm btn-dark w-[150px]" href="{base}/admin/dashboard"
		><ArrowBigLeft /> Go back</a
	>
	<UploadStatus user={data.user} />
</div>
