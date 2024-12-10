<script lang="ts">
	import DeleteDialog from './delete-dialog.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { CheckCheck, LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import { getContext } from 'svelte';
	import { url_from_cdms_tag, url_from_jpl_tag } from '$lib/core';
	import { Description } from '$lib/components/ui/card';
	import { base } from '$app/paths';
	import { toast } from 'svelte-sonner';
	import { fileInputs } from '$lib/schemas/metadata';
	import FormCheckbox from '$lib/components/forms/form-checkbox.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Tiptap from '$lib/components/Tiptap.svelte';
	import Loader from '$lib/components/utils/loader.svelte';

	export let obj: SpeciesMetadata | MetaReference;

	const api_key = getContext('api_key') as string;
	const include_keys = getContext('include_keys') as (keyof (SpeciesMetadata | MetaReference))[];

	let checked_row = include_keys.map((key) => ({ name: key, checked: false, disabled: true }));
	let files_checked_row: {
		name: string;
		checked: boolean;
		disabled: boolean;
		file: File | null;
	}[] = fileInputs['species-metadata'].map(({ name }) => ({
		name,
		checked: true,
		disabled: true,
		file: null
	}));
	$: all_approved = [...checked_row, ...files_checked_row].every((f) => f.checked);
	let approve_all = false;

	const source_link =
		obj.linelist_name.toLocaleLowerCase() === 'jpl'
			? url_from_jpl_tag(obj.molecule_tag, true)
			: url_from_cdms_tag(obj.molecule_tag);

	let modified = false;
	let uploading = false;
	const onSubmit: SubmitFunction = () => {
		uploading = true;
		return async ({ update }) => {
			uploading = false;
			await update();
		};
	};
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
	use:enhance={onSubmit}
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
					{#if disabled}
						<span class="text-gray-500 px-4">{@html obj[name] || 'No notes'}</span>
					{:else}
						<Textarea hidden bind:value={obj[name]} {name} />
						<Tiptap setValue={(value) => (obj[name] = value)} content={obj[name]} />
					{/if}
				{:else if typeof obj[name] === 'boolean'}
					<FormCheckbox bind:checked={obj[name]} {disabled} {name} label="" />
				{:else if ['vib_qn', 'qn_label_str'].includes(name)}
					<span class="text-gray-500 px-4">{obj[name] || 'Not available'}</span>
					{#if !disabled}
						<span class="text-sm"
							>You cannot edit this field, due to the nature of the data (line informations are
							already parsed with molsim)
						</span>
						<span class="text-sm text-red">Reject this entry if labelling is wrong.</span>
					{/if}
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
			</div>
		{/each}
	</div>

	{#if api_key === 'species-metadata'}
		<div class="grid">
			<span>Attached files (Download and check)</span>
			<span class="flex gap-4 items-center text-sm text-gray">
				<UnlockKeyhole />
				Unlock to upload new files
			</span>
		</div>

		<div class="grid-auto-fill">
			{#each files_checked_row as { name, checked, disabled, file }}
				{@const filename = obj[name]?.split('/').pop()}

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
					{#if filename && disabled}
						{@const href = `${base}/uploads/sp/${filename}`}
						<a class="btn btn-sm btn-primary w-45" {href} target="_blank" rel="noopener noreferrer">
							<span>Download</span>
						</a>
					{:else if name === 'cat_file'}
						{#if disabled}
							<span class="text-gray-500 text-sm">Awaiting cat file upload from user</span>
						{:else}
							<span class="text-sm">
								You cannot upload new cat file here, due to the nature of the data (line
								informations are only parsed with molsim when uploaded through Line page)
							</span>
						{/if}
					{:else if name === 'qpart_file' && obj.cat_file}
						<span class="text-sm">
							You cannot upload new qpart file here, due to the nature of the data (line
							informations are already parsed with molsim using uploaded cat file and qpart file)
						</span>
					{:else}
						<Input
							type="file"
							{name}
							{disabled}
							on:input={(e) => {
								const newfile = e.target?.files?.[0];
								const allowed_ext = '.' + name.split('_')[0];
								if (newfile && !newfile.name.endsWith(allowed_ext)) {
									toast.error(`File extension should be ${allowed_ext}`);
									e.target.value = '';
									return;
								}
								toast.success('File attached');
								file = newfile;
							}}
						/>
						<span class="text-sm flex items-center gap-4">
							{#if file?.size}
								<CheckCheck />
								<span>New file attached</span>
							{:else if disabled}
								<span class="text-gray-500">{`No .${name.split('_')[0]} file attached`}</span>
							{:else}
								<span class="text-gray-500">Attach new .{name.split('_')[0]} file</span>
								{#if filename}
									<span class=" text-red">Leaving it empty will delete the file</span>
								{/if}
							{/if}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<div class="flex gap-4 ml-auto">
		<DeleteDialog id={obj.id} />
		{#if api_key === 'species-metadata'}
			{#if obj.cat_file}
				<Button type="submit" disabled={!all_approved || uploading}>
					<Loader fetching={uploading} description="Uploading..." />
					{#if !uploading}
						<span>Approve</span>
					{/if}
				</Button>
			{:else}
				<span class="text-gray-500 text-sm">
					Please wait for the user to upload the cat file to approve. OR if cat is file uploaded
					then try re-fetching the data (top right corner)
				</span>
			{/if}
		{:else}
			<Button type="submit" disabled={!all_approved || uploading}>
				<Loader fetching={uploading} description="Uploading..." />
				{#if !uploading}
					<span>Approve</span>
				{/if}
			</Button>
		{/if}
	</div>
</form>
