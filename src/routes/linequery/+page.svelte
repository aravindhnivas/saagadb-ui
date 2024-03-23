<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import type { PageData } from './$types';
	import Linetable from './linetable.svelte';

	export let data: PageData;
	// console.log(data);
</script>

<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>

<div class="grid gap-5 content-start px-5">
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
			<!-- <AlertBox>
				<svelte:fragment slot="message">
					The following line informations are derived from the uploaded .cat file using
					<a href="https://github.com/bmcguir2/molsim" target="_blank" rel="noopener noreferrer">
						<em class="underline">molsim</em>
					</a>
					script
				</svelte:fragment>
			</AlertBox> -->
			<Linetable {lines} />
		{:else}
			<p>No lines found</p>
		{/if}
	{:catch error}
		<AlertBox {error} />
	{/await}
</div>
