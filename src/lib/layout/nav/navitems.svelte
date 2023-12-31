<script lang="ts">
	import { page } from '$app/stores';
	const nav = [
		{ name: 'Home', href: '/' },
		{ name: 'Species', href: '/species' },
		{ name: 'Line-query', href: '/linequery' }
	];
</script>

{#each nav as { href, name }}
	<li><a class:active={$page.route.id == href} {href}>{name}</a></li>
{/each}

<li class="dropdown dropdown-end">
	<div tabindex="0" role="button">Misc. ↓</div>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
	>
		<li><a href="http://herzberg.mit.edu:8080" target="_blank">PDF-to-Table</a></li>
	</ul>
</li>
