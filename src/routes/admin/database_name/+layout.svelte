<script lang="ts">
	import { page } from '$app/stores';

	const db_menu = [
		{ id: crypto.randomUUID(), name: 'linelist', href: '/admin/database_name/linelist' },
		{ id: crypto.randomUUID(), name: 'add_linelist', href: '/admin/database_name/add_linelist' }
	];

	let active_tab = db_menu.find((f) => $page.url.pathname.startsWith(f.href))?.name;
</script>

<div class="tabs mb-2">
	{#each db_menu as { id, name, href } (id)}
		<a
			{href}
			class="tab tab-bordered"
			class:tab-active={active_tab === name}
			on:click={() => {
				active_tab = name;
			}}
		>
			{name}
		</a>
	{/each}
</div>

<slot />
