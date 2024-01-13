<script lang="ts">
	import { page } from '$app/stores';
	import { v4 as uuidv4 } from 'uuid';
	const admin_menu = [
		{ id: uuidv4(), name: 'Dashboard', href: '/admin/dashboard' },
		{ id: uuidv4(), name: 'Create New user', href: '/admin/create_user' },
		{ id: uuidv4(), name: 'Database name', href: '/admin/database_name' },
		{ id: uuidv4(), name: 'Species', href: '/admin/species' },
		{ id: uuidv4(), name: 'Metadata', href: '/admin/meta-data/index' }
	];
	let active_tab = admin_menu.find((f) => $page.url.pathname.startsWith(f.href))?.name;
</script>

<div class="settings__div">
	<ul class=" menu menu-sm lg:menu-md px-4 py-0 gap-0.5">
		<li class="menu-title">Admin panel</li>
		{#each admin_menu as { href, name, id } (id)}
			<li>
				<a
					class:active={active_tab === name}
					{href}
					on:click={() => {
						active_tab = name;
					}}>{name}</a
				>
			</li>
		{/each}
	</ul>
	<div class="child"><slot /></div>
</div>

<style lang="scss">
	.settings__div {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		overflow: hidden;

		// .child {
		// 	overflow: auto;
		// }
	}
</style>
