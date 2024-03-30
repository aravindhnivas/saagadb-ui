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
	import { Textarea } from '$lib/components/ui/textarea';
	import Tiptap from '$lib/components/Tiptap.svelte';

	export let id: string;
	export let metadata: {
		[name: string]: string;
	};
	export let edit: boolean = false;

	// console.log(metadata);
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
				// metadata = data?.posted;
			} else if (data?.message) {
				toast.error(data.message);
			}
			disabled = true;
			await update();
		};
	};

	const fields = api_fields[$page.params.apiName];
	let edit_files = {} as Record<number, boolean>;

	fields.forEach((field, ind) => {
		if (field.file) {
			edit_files[ind] = false;
		}
	});
	// $: console.log(edit_files);
	let disabled = true;

	let smiles = metadata.smiles || metadata.species_smiles;
	let mol: ReturnType<typeof window.RDKit.get_mol>;
	const auto_fill_inchi_info = (smi: string, notify: boolean = false) => {
		try {
			if (!smi) return toast.error('Please enter a SMILES string first');
			if (!window.RDKit) return toast.error('RDKit not loaded. Please refresh the page.');
			mol = window.RDKit.get_mol(smi);
			// console.log(mol);
			if (!mol) {
				if (notify) toast.error('Invalid SMILES string');
				return;
			}
			const InChI = mol.get_inchi();
			const InChIkey = window.RDKit.get_inchikey_for_inchi(mol?.get_inchi());
			if (metadata.standard_inchi) metadata.standard_inchi = InChI;
			if (metadata.standard_inchi_key) metadata.standard_inchi_key = InChIkey;
			if (notify) toast.success('InChI and InChIKey auto-filled');
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
	};

	onMount(() => {
		// console.log(smiles);
		if (smiles) {
			auto_fill_inchi_info(smiles);
		}
	});
</script>

<form {id} use:enhance={onSubmit} method="POST" enctype="multipart/form-data">
	<div class="grid border-solid border-2 border-rounded-2 p-5 gap-1">
		{#if edit}
			<div class="flex gap-4 items-center w-full">
				<Button
					variant="outline"
					class="w-[100px] flex gap-4 items-center"
					on:click={(e) => {
						e.preventDefault();
						disabled = !disabled;
					}}
				>
					{#if disabled}
						<LockKeyhole />
					{:else}
						<UnlockKeyhole />
					{/if}
					<span>Edit</span>
				</Button>
				{#if disabled && mol}
					<div class="ml-auto">{@html mol.get_svg(100, 50)}</div>
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
		{:else if mol}
			<div class="ml-auto">{@html mol.get_svg(100, 50)}</div>
		{/if}
		{#each fields as { name, label, editable, link, download, file }, ind}
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
									<a
										class="text-blue underline text-sm font-italic"
										href={metadata[name]}
										target="_blank"
										rel="noopener noreferrer"
									>
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
						<Input type="text" value={metadata[name]} class="h-7 col-span-3" {name} />
						<div class="flex gap-2 items-center h-[100px]">
							<button
								class="btn btn-sm"
								on:click|preventDefault={() => {
									auto_fill_inchi_info(metadata[name], true);
								}}
							>
								<span>Draw & auto-fill InChI</span>
							</button>
							{#if mol}
								<div>{@html mol?.get_svg(100, 50)}</div>
							{:else}
								<span class="text-red">Invalid SMILES</span>
							{/if}
						</div>
					{:else if name === 'notes'}
						{#if disabled}
							<span class="text-gray-500 px-4">{@html metadata[name] || 'No notes'}</span>
						{:else}
							<Textarea hidden bind:value={metadata[name]} {name} />
							<div class="col-span-3">
								<Tiptap setValue={(value) => (metadata[name] = value)} content={metadata[name]} />
							</div>
						{/if}
					{:else if file}
						{#if metadata[name]}
							<button
								class="select-none"
								class:col-span-3={!edit_files[ind]}
								on:click={(e) => {
									e.preventDefault();
									edit_files[ind] = !edit_files[ind];
								}}
							>
								{#if edit_files[ind]}
									<UnlockKeyhole />
								{:else}
									<div class="flex items-center gap-4">
										<span><LockKeyhole /></span>
										<span>Unlock to replace "<em>{name}</em>" </span>
									</div>
								{/if}
							</button>

							{#if edit_files[ind]}
								<Input type="file" class="col-span-2" {name} />
							{/if}
						{:else}
							<Input type="file" class="col-span-3" {name} />
						{/if}
					{:else}
						<Input type="text" value={metadata[name]} class="col-span-3" {name} />
					{/if}
				{/if}
			</div>
			{#if disabled}
				<Separator />
			{/if}
		{/each}
	</div>
</form>
