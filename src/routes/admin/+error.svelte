<script lang="ts">
	import { page } from '$app/stores';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
</script>

<div class="h-5">
	<AlertBox
		variant="destructive"
		message={$page.error?.message}
		title={$page.error?.title || 'Internal Error'}
	/>
</div>
