<script lang="ts">
	import type { PageData } from './$types';
	import UploadStatus from '../../dashboard/upload-status.svelte';
	import { setContext } from 'svelte';

	export let data: PageData;
	setContext('allow_edit', data.allow_edit);
</script>

<UploadStatus user={data.user} fetch_upload_count={data.fetch_upload_count(data.user)} />
