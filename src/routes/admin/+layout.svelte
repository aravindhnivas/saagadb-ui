<script lang="ts">
	import { page } from '$app/stores';
	const admin_menu = [
		{ id: crypto.randomUUID(), name: 'Dashboard', href: '/admin/dashboard' },
		{ id: crypto.randomUUID(), name: 'Create New user', href: '/admin/create_user' },
		{ id: crypto.randomUUID(), name: 'Database name', href: '/admin/database_name' },
		{ id: crypto.randomUUID(), name: 'Species', href: '/admin/species' },
		{ id: crypto.randomUUID(), name: 'Metadata', href: '/admin/meta' }
	];
	let active_tab = admin_menu.find((f) => $page.url.pathname.startsWith(f.href))?.name;
</script>

<div class="settings__div">
	<ul class="menu bg-base-200 w-56 rounded-box gap-2">
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

		.child {
			overflow: auto;
		}
	}
</style>
