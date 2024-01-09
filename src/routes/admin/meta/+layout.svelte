<script lang="ts">
	import { page } from '$app/stores';

	const meta_menu = [
		{ name: 'species-metadata', href: '/admin/meta/species-metadata' },
		{ name: 'reference', href: '/admin/meta/reference' },
		{ name: 'meta-reference', href: '/admin/meta/meta-reference' },
		{ name: 'line', href: '/admin/meta/line' }
	];

	let active_tab = meta_menu.find((f) => $page.url.pathname.startsWith(f.href))?.name;
</script>

<div class="tabs mb-2">
	{#each meta_menu as { name, href }}
		<a
			{href}
			class="tab tab-bordered"
			class:tab-active={active_tab === name}
			on:click={() => {
				active_tab = name;
			}}>{name}</a
		>
	{/each}
</div>

<slot />
