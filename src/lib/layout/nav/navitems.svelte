<script lang="ts">
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
</script>

{#each nav as { href, name }}
	<li>
		<a on:click={() => (active_page = href)} class:active={active_page === href} {href}>{name}</a>
	</li>
{/each}
