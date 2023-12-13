<script lang="ts">
	import type { PageData } from './$types';
	import Linetable from './linetable.svelte';

	export let data: PageData;

	let min_freq = 600;
	let max_freq = 2000;
</script>

<div class="flex gap-2">
	<label class="form-control w-full max-w-xs">
		<input
			name="min_freq"
			type="text"
			placeholder="Type here"
			bind:value={min_freq}
			class="input input-bordered w-full max-w-xs"
		/>
		<div class="label">
			<span class="label-text-alt">Minimum frequency</span>
		</div>
	</label>

	<label class="form-control w-full max-w-xs">
		<input
			name="max_freq"
			type="text"
			bind:value={max_freq}
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
		<div class="label">
			<span class="label-text-alt">Maximum frequency</span>
		</div>
	</label>

	<a href="/linequery?max_freq={max_freq}&min_freq={min_freq}" class="btn btn-primary">Submit</a>
</div>

{#if data?.lines?.length > 0}
	<Linetable lines={data?.lines ?? []} />
{/if}
