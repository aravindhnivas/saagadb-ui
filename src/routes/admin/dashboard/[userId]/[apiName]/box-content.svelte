<script lang="ts">
	import { AlertTriangle, CheckCheck, LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { api_fields } from './api-fields';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	export let metadata: {
		[name: string]: string;
	};

	const fields = api_fields[$page.params.apiName];
	let disabled = true;
</script>

<div class="grid border-solid border-2 p-5">
	<div class="flex gap-4 items-center w-full my-2">
		<button
			class="w-max"
			on:click|preventDefault={() => {
				disabled = !disabled;
			}}
		>
			{#if disabled}
				<LockKeyhole />
			{:else}
				<UnlockKeyhole />
			{/if}
		</button>
		{#if !disabled}
			<Button
				formaction="?/update_metadata&id={metadata.id}"
				type="submit"
				class="ml-auto"
				variant="outline">Save</Button
			>
		{/if}
	</div>

	{#each fields as { name, label }}
		<div class="grid grid-cols-4 items-center">
			{#if name === 'approved'}
				{#if metadata[name]}
					<div class="text-green-700"><CheckCheck /></div>
					<div class="col-span-3 text-green-700">APPROVED</div>
				{:else}
					<div class="text-red"><AlertTriangle /></div>
					<div class="col-span-3 text-red">PENDING APPROVAL</div>
				{/if}
			{:else}
				<div>{@html label}</div>
				{#if disabled}
					<div class="col-span-3">{metadata[name] ?? '-'}</div>
				{:else}
					<Input type="text" bind:value={metadata[name]} class="h-7 col-span-3" {name} />
				{/if}
			{/if}
		</div>
		<Separator />
	{/each}
</div>
