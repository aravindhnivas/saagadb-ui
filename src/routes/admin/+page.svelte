<script lang="ts">
	import { logged_in } from '$lib/utils';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	logged_in.set(data?.email);
</script>

Admin page
