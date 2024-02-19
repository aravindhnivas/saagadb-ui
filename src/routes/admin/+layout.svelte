<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { v4 as uuidv4 } from 'uuid';
	import type { LayoutData } from './$types';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Alert from '$lib/components/ui/alert/alert.svelte';
	import { onMount } from 'svelte';

	interface AdminMenu {
		id: string;
		name: string;
		href: string;
		requires_active_user: boolean;
		requires_admin_user: boolean;
	}

	const admin_menu: AdminMenu[] = [
		{
			id: uuidv4(),
			name: 'Dashboard',
			href: base + '/admin/dashboard',
			requires_active_user: false,
			requires_admin_user: false
		},
		{
			id: uuidv4(),
			name: 'Create New user',
			href: base + '/admin/create_user',
			requires_active_user: true,
			requires_admin_user: true
		},
		{
			id: uuidv4(),
			name: 'Database name',
			href: base + '/admin/database_name',
			requires_active_user: true,
			requires_admin_user: true
		},
		{
			id: uuidv4(),
			name: 'Species',
			href: base + '/admin/species',
			requires_active_user: true,
			requires_admin_user: false
		},
		{
			id: uuidv4(),
			name: 'Metadata',
			href: base + '/admin/meta-data',
			requires_active_user: true,
			requires_admin_user: false
		},
		{
			id: uuidv4(),
			name: 'Profile',
			href: base + '/admin/profile',
			requires_active_user: false,
			requires_admin_user: false
		}
	];

	// let current_page: AdminMenu = admin_menu[0];
	$: current_page = admin_menu.find((f) => $page.url.pathname.startsWith(f.href)) ?? admin_menu[0];
	let active_tab: string;

	export let data: LayoutData;

	onMount(() => {
		active_tab = current_page.name;
	});
</script>

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
		{:else if current_page.requires_active_user && !data.user.is_verified}
			<AlertBox title="Activation required to POST data">
				<svelte:fragment slot="message">
					<div class="flex flex-col">
						<span>Please verify your email to activate your account. </span>
					</div>
				</svelte:fragment>
			</AlertBox>
		{:else}
			<slot />
		{/if}
	</div>
</div>

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
