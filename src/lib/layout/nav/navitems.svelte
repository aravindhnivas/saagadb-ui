<script lang="ts">
	import { logged_in } from '$lib/utils/stores';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	const nav = [
		{ name: 'Home', href: base + '/' },
		{ name: 'Species', href: base + '/species' },
		{ name: 'Line-query', href: base + '/linequery' }
	];

	let active_page: string;

	onMount(() => {
		active_page = $page.url.pathname;
	});
	// $: console.log(active_page);
</script>

{#each nav as { href, name }}
	<li>
		<a on:click={() => (active_page = href)} class:active={active_page === href} {href}>{name}</a>
	</li>
{/each}

<li class="dropdown dropdown-end">
	<div tabindex="0" role="button">Misc. ↓</div>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
	>
		<li><a href="http://herzberg.mit.edu:8080" target="_blank">PDF-to-Table</a></li>

		{#if $logged_in}
			<li>
				<a href="http://herzberg.mit.edu:8000/api/docs" target="_blank">Swagger UI (Backed APIs)</a>
			</li>
		{/if}
	</ul>
</li>
