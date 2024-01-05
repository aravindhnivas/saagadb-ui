<script lang="ts">
	import { page } from '$app/stores';

	const admin_menu = [
		{ name: 'Dashboard', href: '/admin/dashboard' },
		{ name: 'Create New user', href: '/admin/create_user' },
		{ name: 'Species', href: '/admin/species' },
		{ name: 'Database name', href: '/admin/database_name' },
		{ name: 'Metadata', href: '/admin/meta' },
		{ name: 'Lines', href: '/admin/lines' }
	];
</script>

<div class="settings__div">
	<ul class="menu bg-base-200 w-56 rounded-box gap-2">
		<li class="menu-title">Admin panel</li>
		{#each admin_menu as { href, name }}
			<li><a class:active={$page.route.id?.startsWith(href)} {href}>{name}</a></li>
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
