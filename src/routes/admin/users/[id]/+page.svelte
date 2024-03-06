<script lang="ts">
	import type { PageData } from './$types';
	import UploadStatus from '../../dashboard/upload-status.svelte';

	export let data: PageData;
</script>

<UploadStatus user={data.user} fetch_upload_count={data.fetch_upload_count(data.user)} />
