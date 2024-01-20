<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { v4 as uuidv4 } from 'uuid';
	const db_menu = [
		{ id: uuidv4(), name: 'linelist', href: base + '/admin/database_name/linelist' },
		{ id: uuidv4(), name: 'add_linelist', href: base + '/admin/database_name/add-linelist' }
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
