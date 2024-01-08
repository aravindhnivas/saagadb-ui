<script lang="ts">
	const admin_menu = [
		{ name: 'Dashboard', href: '/admin/dashboard' },
		{ name: 'Create New user', href: '/admin/create_user' },
		{ name: 'Database name', href: '/admin/database_name' },
		{ name: 'Species', href: '/admin/species' },
		{ name: 'Metadata', href: '/admin/meta' }
	];

	let active_tab = admin_menu[0].name;
</script>

<div class="settings__div">
	<ul class="menu bg-base-200 w-56 rounded-box gap-2">
		<li class="menu-title">Admin panel</li>
		{#each admin_menu as { href, name }}
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
