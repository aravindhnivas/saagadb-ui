<script lang="ts">
	import { page } from '$app/stores';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
</script>

<AlertBox message={$page.error?.message} title="Unauthorized" />
