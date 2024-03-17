<script lang="ts">
	import type { ActionData } from './$types';
	import {
		AlertTriangle,
		CheckCheck,
		Download,
		LockKeyhole,
		UnlockKeyhole
	} from 'lucide-svelte/icons';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { api_fields } from './api-fields';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import FormCheckbox from '$lib/components/forms/form-checkbox.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	export let metadata: {
		[name: string]: string;
	};
	export let edit: boolean = false;
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

	let mol: ReturnType<typeof window.RDKit.get_mol>;
	const auto_fill_inchi_info = () => {
		try {
			if (!metadata.smiles) return toast.error('Please enter a SMILES string first');
			if (!window.RDKit) return toast.error('RDKit not loaded. Please refresh the page.');
			mol = window.RDKit.get_mol(metadata.smiles);
			if (!mol) return toast.error('Invalid SMILES string');
			const InChI = mol.get_inchi();
			const InChIkey = window.RDKit.get_inchikey_for_inchi(mol?.get_inchi());
			metadata.standard_inchi = InChI;
			metadata.standard_inchi_key = InChIkey;
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	onMount(() => {
		if ($page.params.apiName === 'species' && metadata.smiles) {
			auto_fill_inchi_info();
		}
	});
</script>

<form id="{metadata.id}-form" use:enhance={onSubmit} method="POST">
	<div class="grid border-solid border-2 p-5 gap-1">
		{#if edit}
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
				{#if disabled && $page.params.apiName === 'species'}
					<div class="ml-auto">{@html mol?.get_svg(100, 50)}</div>
				{/if}
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
		{:else if $page.params.apiName === 'species'}
			<div class="ml-auto">{@html mol?.get_svg(100, 50)}</div>
		{/if}
		{#each fields as { name, label, editable, link, download }}
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
					{#if disabled || editable === false}
						<div class="col-span-3">
							{#if link}
								{#if metadata[name]}
									<a href={metadata[name]} target="_blank" rel="noopener noreferrer">
										{#if download}
											<!-- <div class="flex gap-4 items-center"> -->
											<!-- <span>Download</span> -->
											<Download />
											<!-- </div> -->
										{:else}
											{metadata[name]}
										{/if}
									</a>
								{:else}
									<span class="text-red">File not uploaded</span>
								{/if}
							{:else}
								{@html metadata[name] ?? '-'}
							{/if}
						</div>
						<!-- {/if} -->
					{:else if typeof metadata[name] === 'boolean'}
						<FormCheckbox label="" {disabled} {name} checked={metadata[name]} />
					{:else if name === 'smiles'}
						<Input type="text" bind:value={metadata[name]} class="h-7 col-span-3" {name} />
						<div class="flex gap-2 items-center h-[100px]">
							<button
								class="btn btn-sm"
								on:click|preventDefault={() => {
									auto_fill_inchi_info();
									toast.success('InChI and InChIKey auto-filled');
								}}
							>
								<span>Draw & auto-fill InChI</span>
							</button>
							{#if mol}
								<div>{@html mol?.get_svg(100, 50)}</div>
							{/if}
						</div>
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
