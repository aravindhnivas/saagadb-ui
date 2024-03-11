<script lang="ts">
	import { base } from '$app/paths';
	import { logged_in } from '$lib/utils/stores';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LayoutDashboard, LogOut, Menu } from 'lucide-svelte/icons';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	const nav = [
		{ name: 'Home', href: base + '/' },
		{ name: 'Species', href: base + '/species' },
		{ name: 'Line-query', href: base + '/linequery' }
	];

	let active_page: string;
	onMount(() => {
		active_page = $page.url.pathname;
	});
</script>

<div class="navbar">
	<div class="navbar-start">
		<div class="dropdown">
			<!-- display dropdown menu on mobile -->
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button class="lg:hidden" builders={[builder]} variant="outline"
						><Menu class="mr-2 h-4 w-4" /></Button
					>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56">
					<DropdownMenu.Label>Navigate</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each nav as { href, name }}
						<DropdownMenu.Item>
							<a on:click={() => (active_page = href)} class:active={active_page === href} {href}
								>{name}</a
							>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<!-- display navbar in larger screen -->
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1 gap-2">
			{#each nav as { href, name }}
				<li>
					<a on:click={() => (active_page = href)} class:active={active_page === href} {href}
						>{name}</a
					>
				</li>
			{/each}
		</ul>
	</div>
	<div class="navbar-end">
		<div class="dropdown dropdown-end">
			{#if $logged_in}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} variant="outline">Hi, {$logged_in}</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>My Account</DropdownMenu.Label>
						<DropdownMenu.Separator />

						<DropdownMenu.Item>
							<LayoutDashboard class="mr-2 h-4 w-4" />
							<a href="{base}/admin/dashboard">Dashboard</a>
						</DropdownMenu.Item>

						<DropdownMenu.Item>
							<LogOut class="mr-2 h-4 w-4" />
							<form action="{base}/logout" method="POST">
								<button type="submit">Logout</button>
							</form>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<a href="{base}/login">Login</a>
			{/if}
		</div>
	</div>
</div>
