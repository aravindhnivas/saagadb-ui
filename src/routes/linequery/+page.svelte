<script lang="ts">
	import type { PageData } from './$types';
	import Linetable from './linetable.svelte';

	export let data: PageData;
</script>

<form class="flex gap-2" method="GET" action="/linequery">
	<label class="form-control w-full max-w-xs">
		<input
			name="min_freq"
			type="text"
			placeholder="Type here"
			value="600"
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
			value="2000"
			placeholder="Type here"
			class="input input-bordered w-full max-w-xs"
		/>
		<div class="label">
			<span class="label-text-alt">Maximum frequency</span>
		</div>
	</label>

	<button class="btn btn-primary">Submit</button>
</form>

{#if data?.lines?.length > 0}
	<Linetable lines={data.lines} />
{/if}
