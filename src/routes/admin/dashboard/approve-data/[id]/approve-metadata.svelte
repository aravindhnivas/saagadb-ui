<script lang="ts">
	import DeleteDialog from './delete-dialog.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Download, LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import { getContext } from 'svelte';
	import { url_from_cdms_tag, url_from_jpl_tag } from '$lib/core';
	import { Description } from '$lib/components/ui/card';
	import { base } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { fileInputs } from '$lib/schemas/metadata';
	import * as Table from '$lib/components/ui/table';

	export let obj: SpeciesMetadata | MetaReference;

	const api_key = getContext('api_key') as string;
	const include_keys = getContext('include_keys') as (keyof (SpeciesMetadata | MetaReference))[];

	let checked_row = include_keys.map((key) => ({ name: key, checked: false, disabled: true }));
	let files_checked_row = fileInputs['species-metadata'].map(({ name }) => ({
		name,
		checked: true,
		disabled: true
	}));
	// $: all_approved = checked_row.every((f) => f.checked);
	$: all_approved = [...checked_row, ...files_checked_row].every((f) => f.checked);
	let approve_all = false;

	const source_link =
		obj.linelist_name.toLocaleLowerCase() === 'jpl'
			? url_from_jpl_tag(obj.molecule_tag, true)
			: url_from_cdms_tag(obj.molecule_tag);

	let modified = false;
</script>

<div class="flex gap-4 items-center p-2">
	<Checkbox
		bind:checked={approve_all}
		onCheckedChange={(state) => {
			if (state === 'indeterminate') return;
			checked_row = checked_row.map((f) => ({ ...f, checked: state }));
		}}
	/>
	<Label>Select all to approve</Label>
	<a href={source_link} target="_blank" rel="noopener noreferrer" class="underline">
		Check {obj.linelist_name.toLocaleUpperCase()} source
	</a>
	{#if modified}
		<Button
			class="ml-auto"
			variant="outline"
			on:click={async (e) => {
				e.preventDefault();
				const res = await fetch(`${base}/api/data/${api_key}/${obj.id}`);
				if (!res.ok) return toast.error(res.statusText);
				const data = await res.json();
				// console.log(data);
				for (const key of include_keys) {
					obj[key] = data[key];
				}
				modified = false;
				checked_row = checked_row.map((f) => ({ ...f, checked: false, disabled: true }));
				toast.success('Fetched original data');
			}}>Fetch original</Button
		>
	{/if}
</div>

<form
	use:enhance
	class="grid gap-4"
	action="?/approve&id={obj.id}&api_key={api_key}"
	method="POST"
	enctype="multipart/form-data"
>
	<div class="grid-auto-fill">
		{#each checked_row as { name, checked, disabled }}
			<div class="flex flex-col gap-1" class:col-span-3={name === 'notes' || name === 'ref_url'}>
				<div class="flex gap-4 items-center p-2">
					<button
						on:click|preventDefault={() => {
							disabled = !disabled;
							modified = true;
						}}
					>
						{#if disabled}
							<LockKeyhole />
						{:else}
							<UnlockKeyhole />
						{/if}
					</button>
					<Label for={name}>{name}</Label>
					<Checkbox bind:checked />
				</div>
				{#if name === 'notes'}
					<Textarea {disabled} bind:value={obj[name]} {name} />
				{:else}
					<Input {disabled} bind:value={obj[name]} {name} />
				{/if}

				{#if name === 'ref_url'}
					<Description>
						{#if obj[name]}
							<a href={obj[name]} target="_blank" rel="noopener noreferrer" class="underline">
								Check reference link
							</a>
						{/if}
					</Description>
				{/if}

				{#if typeof obj[name] === 'boolean'}
					{#if !disabled}
						<div class="flex gap-2 items-center">
							<input type="checkbox" bind:checked={obj[name]} class="checkbox" />
							<Description>use this checkbox to change value</Description>
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</div>

	{#if api_key === 'species-metadata'}
		<div class="grid">
			<span>Attached files (Download and check)</span>
			<span class="text-sm text-gray">
				If int_file and var_file are attached, then the dipole moments and rotaional constants are
				extracted and overwritten from the former and latter files, respectively.
			</span>
			<span class="flex gap-4 items-center text-sm text-gray">
				<UnlockKeyhole />
				Unlock to upload new files
			</span>
		</div>

		<div class="grid-auto-fill">
			{#each files_checked_row as { name, checked, disabled }}
				<div class="flex flex-col gap-1">
					<div class="flex gap-4 items-center p-2">
						<button
							on:click|preventDefault={() => {
								disabled = !disabled;
								modified = true;
							}}
						>
							{#if disabled}
								<LockKeyhole />
							{:else}
								<UnlockKeyhole />
							{/if}
						</button>
						<Label for={name}>{name}</Label>
						<Checkbox bind:checked />
					</div>
					{#if obj[name]}
						{@const filename = obj[name].split('/').pop()}
						{@const href = `${base}/uploads/sp/${filename}`}
						{#if disabled}
							<a
								class="btn btn-sm btn-primary w-45"
								{href}
								target="_blank"
								rel="noopener noreferrer"
							>
								<span>Download</span>
							</a>
						{:else}
							<Input type="file" {disabled} {name} />
							<span class="text-sm">Attach a new <em>.{name.split('_')[0]}</em></span>
						{/if}
					{:else}
						<Input type="file" {disabled} {name} />
						<span class="text-sm">No <em>.{name.split('_')[0]}</em> attached</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex gap-4 ml-auto">
		<DeleteDialog id={obj.id} />
		<Button type="submit" disabled={!all_approved}>Approve</Button>
	</div>
</form>
