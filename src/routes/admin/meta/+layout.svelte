<script lang="ts">
	const meta_href = [
		{ name: 'species-metadata', href: '/admin/meta/species-metadata' },
		{ name: 'reference', href: '/admin/meta/reference' },
		{ name: 'meta-reference', href: '/admin/meta/meta-reference' },
		{ name: 'line', href: '/admin/meta/line' }
	];

	let active_tab = meta_href[0].name;
</script>

<div class="tabs">
	{#each meta_href as { name, href }}
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
