<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import Navitems from './nav/navitems.svelte';
</script>

<div class="navbar bg-base-100">
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
			<ul
				tabindex="0"
				class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
			>
				<Navitems />
			</ul>
		</div>
		<a href="/" class="btn btn-ghost normal-case text-xl">SAAGAdb</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal px-1 gap-2">
			<Navitems />
		</ul>
	</div>
	<div class="navbar-end">
		<div class="dropdown dropdown-end">
			{#if $logged_in}
				<div tabindex="0" role="button">
					Hi, {$logged_in}
				</div>
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<ul
					tabindex="0"
					class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
				>
					<li><a href="/admin">Dashboard</a></li>
					<li>
						<form action="/logout" method="POST">
							<button>logout</button>
						</form>
					</li>
				</ul>
			{:else}
				<a href="/login">Login</a>
			{/if}
		</div>
	</div>
</div>
