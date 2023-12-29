<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { LayoutServerData } from '../$types';
	export let data: LayoutServerData;
	const { user } = data;
	$: if (user) {
		logged_in.set(user.name);
	}
</script>

{JSON.stringify(user)}
