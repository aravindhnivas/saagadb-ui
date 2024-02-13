<script lang="ts">
	import type { PageData } from './$types';
	import Linetable from './linetable.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>

<div class="grid gap-5 content-start">
	<form class="flex gap-2 items-end" method="GET">
		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text-alt">Minimum frequency</span>
			</div>
			<input
				name="min_freq"
				type="text"
				placeholder="Type here"
				value=""
				class="input input-bordered w-full max-w-xs"
			/>
		</label>

		<label class="form-control w-full max-w-xs">
			<div class="label">
				<span class="label-text-alt">Maximum frequency</span>
			</div>
			<input
				name="max_freq"
				type="text"
				value=""
				placeholder="Type here"
				class="input input-bordered w-full max-w-xs"
			/>
		</label>

		<button class="btn btn-primary btn-loading">Submit</button>
	</form>

	{#await data.lines}
		<div class="flex gap-2 items-center">
			<span class="loading loading-spinner"></span>
			<span>Fetching data please wait...</span>
		</div>
	{:then lines}
		{#if lines?.length > 0}
			<Linetable {lines} />
		{:else}
			<p>No lines found</p>
		{/if}
	{:catch error}
		<div role="alert" class="alert alert-error">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="stroke-current shrink-0 h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/></svg
			>
			<span>{error?.body?.message ?? 'Internal error'}</span>
		</div>
	{/await}
</div>
