<script lang="ts">
	import { logged_in } from '$lib/utils';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	const { user } = data;
	logged_in.set(user?.name);
</script>

{JSON.stringify(user)}
