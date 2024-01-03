<script lang="ts">
	import 'uno.css';
	import '@unocss/reset/tailwind.css';
	import 'tabulator-tables/dist/css/tabulator_simple.min.css';
	import '../global.scss';
	import Footer from '$lib/layout/footer.svelte';
	import Navbar from '$lib/layout/navbar.svelte';
	import { logged_in } from '$lib/utils/stores';
	import type { LayoutServerData } from './$types';
	import { Toaster } from 'svelte-sonner';
	export let data: LayoutServerData;
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

<style lang="scss">
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
		// align-content: baseline;
	}
</style>
