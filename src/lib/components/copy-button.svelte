<script lang="ts">
	import { Check, Copy } from 'lucide-svelte/icons';
	import { onDestroy } from 'svelte';
	import { copy } from 'svelte-copy';
	import { toast } from 'svelte-sonner';

	export let text: string = '';
	let copied = false;

	let timeout: ReturnType<typeof setTimeout>;
	$: if (copied) {
		timeout = setTimeout(() => {
			copied = false;
		}, 2000);
	}

	onDestroy(() => {
		if (timeout) clearTimeout(timeout);
	});
</script>

<button
	use:copy={text}
	on:svelte-copy={(event) => {
		toast.success(`${event.detail}`);
		copied = true;
	}}
	on:svelte-copy:error={(event) => {
		toast.error(`There was an error: ${event.detail.message}`);
	}}
>
	{#if copied}
		<div class="animate__animated animate__fadeIn">
			<Check />
			<span>copied</span>
		</div>
	{:else}
		<Copy class="animate__animated animate__fadeIn " />
	{/if}
</button>
