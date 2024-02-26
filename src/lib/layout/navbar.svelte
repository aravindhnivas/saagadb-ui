<script lang="ts">
	import { base } from '$app/paths';
	import { logged_in } from '$lib/utils/stores';
	import Navitems from './nav/navitems.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LayoutDashboard, LogOut } from 'lucide-svelte/icons';
</script>

<div class="navbar">
	<div class="navbar-start">
		<div class="dropdown">
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<!-- svelte-ignore a11y-label-has-associated-control -->
			<label tabindex="0" class="btn btn-ghost lg:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/></svg
				>
			</label>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow rounded-box w-52">
				<Navitems />
			</ul>
		</div>
		<a href="{base}/" class="btn btn-ghost normal-case text-xl">SAAGAdb</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1 gap-2">
			<Navitems />
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
							<a href="{base}/logout">logout</a>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<a href="{base}/login">Login</a>
			{/if}
		</div>
	</div>
</div>
