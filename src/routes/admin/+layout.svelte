<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { v4 as uuidv4 } from 'uuid';
	import type { LayoutData } from './$types';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { onMount } from 'svelte';

	export let data: LayoutData;

	interface AdminMenu {
		id: string;
		name: string;
		href: string;
		requires_verified_user?: boolean;
		requires_admin_user?: boolean;
		requires_super_user?: boolean;
	}

	const admin_menu: AdminMenu[] = [
		{
			id: uuidv4(),
			name: 'Dashboard',
			href: base + '/admin/dashboard'
		},
		{
			id: uuidv4(),
			name: 'Create New user',
			href: base + '/admin/create_user',
			requires_verified_user: true,
			requires_admin_user: true
		},
		{
			id: uuidv4(),
			name: 'Database name',
			href: base + '/admin/database_name',
			requires_verified_user: true,
			requires_admin_user: true
		},
		{
			id: uuidv4(),
			name: 'Species',
			href: base + '/admin/species',
			requires_verified_user: true
		},
		{
			id: uuidv4(),
			name: 'Metadata',
			href: base + '/admin/meta-data',
			requires_verified_user: true
		},
		{
			id: uuidv4(),
			name: 'Profile',
			href: base + '/admin/profile'
		},
		{
			id: uuidv4(),
			name: 'Users',
			href: base + '/admin/users',
			requires_super_user: true
		}
	];

	$: current_page = admin_menu.find((f) => $page.url.pathname.startsWith(f.href)) ?? admin_menu[0];
	let active_tab: string;

	let mounted = false;
	onMount(() => {
		mounted = true;
		active_tab = current_page.name;
	});
</script>

{#if mounted}
	<div class="settings__div">
		<ul class=" menu menu-sm lg:menu-md px-4 py-0 gap-2">
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
		<div class="child">
			{#if current_page.requires_admin_user && !data.user.is_staff}
				<AlertBox
					title="Access denied"
					message="You do not have the required permission to access this page. Please contact your administrator."
				/>
			{:else if current_page.requires_verified_user && !data.user.is_verified}
				<AlertBox title="Activation required to POST data">
					<svelte:fragment slot="message">
						<div class="flex flex-col">
							<span>Please verify your email to activate your account. </span>
						</div>
					</svelte:fragment>
				</AlertBox>
			{:else if current_page.requires_super_user && !data.user.is_superuser}
				<AlertBox title="Forbidden" variant="destructive">
					<svelte:fragment slot="message">
						<div class="flex flex-col">
							<span>Requires superuser permission</span>
						</div>
					</svelte:fragment>
				</AlertBox>
			{:else}
				<slot />
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	.settings__div {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		overflow: hidden;

		.child {
			user-select: none;
			-webkit-user-select: none;
			overflow: auto;
		}
	}
</style>
