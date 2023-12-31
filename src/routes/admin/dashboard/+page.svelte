<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import type { LayoutServerData } from '../../$types';
	// import type { PageServerData } from './$types';
	import Stats from './stats.svelte';
	export let data: LayoutServerData;

	const { user } = data;
	$: if (user?.name) logged_in.set(user.name);
</script>

{#if user}
	<div class="flex flex-col gap-4">
		<div>
			<div class="text-lg">Hello, {user?.name}</div>
			<div>
				Email: <div class="badge badge-info">{user.email}</div>
			</div>
			<div>
				Organisation: <div class="badge badge-warning">{user.organization}</div>
			</div>
		</div>

		<Stats />
	</div>
{:else}
	<p>Invalid user</p>
{/if}
