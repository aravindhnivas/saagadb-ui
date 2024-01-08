<script lang="ts">
	import { page } from '$app/stores';

	const meta_href = [
		{ name: 'species-metadata', href: '/admin/meta/species-metadata' },
		{ name: 'reference', href: '/admin/meta/reference' },
		{ name: 'meta-reference', href: '/admin/meta/meta-reference' },
		{ name: 'line', href: '/admin/meta/line' }
	];
	let message: string = '';
	$: if ($page.url.searchParams.get('message')) {
		message = $page.url.searchParams.get('message') as string;
	}

	let active_tab = meta_href[0].name;
</script>

<div class="tabs mb-2">
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

{#if message}
	<div role="alert" class="alert alert-warning w-100 m-auto">
		<i class="i-mdi-alert"></i>
		<span>{message}</span>
	</div>
{/if}

<slot />
