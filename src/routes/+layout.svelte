<script lang="ts">
	import 'uno.css';
	import '@unocss/reset/tailwind-compat.css';
	import 'tabulator-tables/dist/css/tabulator_simple.min.css';
	import Footer from '$lib/layout/footer.svelte';
	import Navbar from '$lib/layout/navbar.svelte';
	import { logged_in } from '$lib/utils/stores';
	import type { LayoutData } from './$types';
	import { Toaster } from 'svelte-sonner';

	import '../app.pcss';
	import '../global.scss';

	export let data: LayoutData;

	const { user } = data;
	$: if (user) {
		logged_in.set(user.name);
	}
</script>

<Toaster position="bottom-center" richColors closeButton />

<div class="parent h-full w-full">
	<header><Navbar /></header>
	<main class="p-5">
		<slot />
	</main>
	<footer><Footer /></footer>
</div>

<style>
	.parent {
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-columns: 1fr;
		gap: 0.5em;
	}
	main {
		display: grid;
		overflow: auto;
		height: 100%;
	}
</style>
