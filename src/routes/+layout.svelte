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
	$: if (user) logged_in.set(user.name); // don't delete - this keep the user logged in
</script>

<!-- <svelte:head>
	<script src="https://unpkg.com/@rdkit/rdkit/dist/RDKit_minimal.js"></script>
	<script>
		window
			.initRDKitModule()
			.then(function (RDKit) {
				console.log('RDKit module initialized');
				console.log('RDKit version: ' + RDKit.version());
				window.RDKit = RDKit;
			})
			.catch(() => {
				console.error('Failed to initialize RDKit module');
			});
	</script>
</svelte:head> -->

<Toaster position="top-center" richColors closeButton />

<div class="parent h-full w-full">
	<header><Navbar /></header>
	<main>
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
