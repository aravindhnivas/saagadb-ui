<script lang="ts">
	import { page } from '$app/stores';

	const admin_menu = [
		{ name: 'Dashboard', href: '/admin/dashboard' },
		{ name: 'Species', href: '/admin/species' },
		{ name: 'Metadata', href: '/admin/meta' }
	];
</script>

<div class="settings__div">
	<ul class="menu bg-base-200 w-56 rounded-box gap-2">
		<li class="menu-title">Admin panel</li>
		{#each admin_menu as { href, name }}
			<li><a class:active={$page.route.id == href} {href}>{name}</a></li>
		{/each}
	</ul>
	<slot />
</div>

<style>
	.settings__div {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
	}
</style>
