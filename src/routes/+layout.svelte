<script lang="ts">
	import 'uno.css';
	import '@unocss/reset/tailwind.css';
	// import '$lib/styles/global.scss';
	import 'tabulator-tables/dist/css/tabulator_simple.min.css';
	import '../global.scss';
	import Footer from '$lib/layout/footer.svelte';
	import Navbar from '$lib/layout/navbar.svelte';
</script>

<div class="parent w-full h-full">
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
