<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { v4 as uuidv4 } from 'uuid';
	import type { LayoutData } from './$types';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { onMount } from 'svelte';
	import { LogOut } from 'lucide-svelte/icons';

	export let data: LayoutData;

	interface AdminMenu {
		id: string;
		name: string;
		href: string;
		requires_verified_user?: boolean;
		requires_admin_user?: boolean;
		requires_super_user?: boolean;
		preload: boolean;
	}

	const admin_menu: AdminMenu[] = [
		{
			id: uuidv4(),
			name: 'Dashboard',
			href: base + '/admin/dashboard',
			preload: true
		},
		{
			id: uuidv4(),
			name: 'Create New user',
			href: base + '/admin/create_user',
			requires_verified_user: true,
			requires_admin_user: true,
			preload: data.user.is_staff
		},
		{
			id: uuidv4(),
			name: 'Database name',
			href: base + '/admin/database_name/linelist',
			requires_verified_user: true,
			requires_admin_user: true,
			preload: data.user.is_staff
		},
		{
			id: uuidv4(),
			name: 'Species',
			href: base + '/admin/species',
			requires_verified_user: true,
			preload: true
		},
		{
			id: uuidv4(),
			name: 'Metadata',
			href: base + '/admin/meta-data',
			requires_verified_user: true,
			preload: true
		},
		{
			id: uuidv4(),
			name: 'Profile',
			href: base + '/admin/profile',
			preload: true
		},
		{
			id: uuidv4(),
			name: 'Users control',
			href: base + '/admin/users',
			requires_super_user: true,
			preload: data.user.is_superuser
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
	<div class="grid grid-cols-6 gap-xl overflow-hidden">
		<aside class="col-span-1 bg-gray-800 text-white p-4 flex flex-col">
			<h2 class="text-lg font-bold mb-4">Admin Panel</h2>
			<p class="text-sm text-gray-400 mb-4">
				{data.user.is_superuser ? 'Superuser' : data.user.is_staff ? 'Staff' : 'User'}
			</p>
			<ul class="space-y-2">
				{#each admin_menu as { href, name, id, preload } (id)}
					<li>
						<a
							data-sveltekit-preload-data={preload ? 'hover' : 'false'}
							class="block px-4 py-2 rounded hover:bg-gray-700"
							class:font-bold={active_tab === name}
							{href}
							on:click={() => {
								active_tab = name;
							}}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
			<div class="mt-auto">
				<form
					action="{base}/logout"
					method="POST"
					class="flex items-center space-x-2 text-red-400 hover:text-red-300"
				>
					<LogOut class="h-5 w-5" />
					<button type="submit">Logout</button>
				</form>
			</div>
		</aside>
		<main class="col-span-5 overflow-auto">
			{#if current_page.requires_admin_user && !data.user.is_staff}
				<AlertBox title="Access Denied" message="You do not have permission to access this page." />
			{:else if current_page.requires_verified_user && !data.user.is_verified}
				<AlertBox title="Activation Required">
					<svelte:fragment slot="message">
						<p>Please verify your email to activate your account.</p>
					</svelte:fragment>
				</AlertBox>
			{:else if current_page.requires_super_user && !data.user.is_superuser}
				<AlertBox title="Forbidden" variant="destructive">
					<svelte:fragment slot="message">
						<p>Requires superuser permission</p>
					</svelte:fragment>
				</AlertBox>
			{:else}
				<!-- <div class="overflow-auto max-h-screen"> -->
				<slot />
				<!-- </div> -->
			{/if}
		</main>
	</div>
{/if}
