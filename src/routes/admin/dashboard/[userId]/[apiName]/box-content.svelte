<script lang="ts">
	import type { ActionData } from './$types';
	import { AlertTriangle, CheckCheck, LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { api_fields } from './api-fields';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import FormCheckbox from '$lib/components/forms/form-checkbox.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let metadata: {
		[name: string]: string;
	};

	let uploading = false;

	const onSubmit: SubmitFunction = () => {
		uploading = true;
		return async ({ update, result }) => {
			uploading = false;
			// console.log(result);
			const { data } = result as {
				type: string;
				status: number;
				data: ActionData;
			};
			if (data?.success) {
				toast.success(data.message);
				metadata = data?.posted;
			} else if (data?.message) {
				toast.error(data.message);
			}
			disabled = true;
			await update({ reset: false, invalidateAll: false });
		};
	};

	const fields = api_fields[$page.params.apiName];
	let disabled = true;
	// console.log('mounted');
</script>

<form id="{metadata.id}-form" use:enhance={onSubmit} method="POST">
	<div class="grid border-solid border-2 p-5 gap-1">
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
				<div class="ml-auto">
					{#if uploading}
						<div class="loading loading-spinner"></div>
					{/if}
					<Button
						class={uploading ? 'hidden' : ''}
						formaction="?/update_metadata&id={metadata.id}"
						type="submit"
						variant="outline"
					>
						Save
					</Button>
				</div>
			{/if}
		</div>

		{#each fields as { name, label }}
			<div class="grid grid-cols-4 items-center select-text">
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
						<div class="col-span-3">
							{#if typeof metadata[name] === 'string' && metadata[name].startsWith('http')}
								<a href={metadata[name]} target="_blank" rel="noopener noreferrer">
									{metadata[name]}
								</a>
							{:else}
								{@html metadata[name] ?? '-'}
							{/if}
						</div>
					{:else if typeof metadata[name] === 'boolean'}
						<FormCheckbox label="" {disabled} {name} checked={metadata[name]} />
					{:else}
						<Input type="text" value={metadata[name]} class="h-7 col-span-3" {name} />
					{/if}
				{/if}
			</div>
			{#if disabled}
				<Separator />
			{/if}
		{/each}
	</div>
</form>
