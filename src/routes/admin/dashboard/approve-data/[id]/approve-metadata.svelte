<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import { createEventDispatcher, getContext } from 'svelte';
	import { url_from_cdms_tag, url_from_jpl_tag } from '$lib/core';

	export let obj: SpeciesMetadata | MetaReference;

	const api_key = getContext('api_key') as string;
	const include_keys = getContext('include_keys') as (keyof (SpeciesMetadata | MetaReference))[];

	let checked_row = include_keys.map((key) => ({ name: key, checked: false, disabled: true }));
	$: all_approved = checked_row.every((f) => f.checked);
	let approve_all = false;

	const dispatch = createEventDispatcher();

	const source_link =
		obj.linelist_name.toLocaleLowerCase() === 'jpl'
			? url_from_jpl_tag(obj.molecule_tag, true)
			: url_from_cdms_tag(obj.molecule_tag);
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
			<div class="flex flex-col" class:col-span-3={name === 'notes'}>
				<div class="flex gap-4 items-center p-2">
					<button on:click|preventDefault={() => (disabled = !disabled)}>
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
					<Textarea {disabled} value={obj[name]} {name} />
				{:else}
					<Input {disabled} value={obj[name]} {name} />
				{/if}
			</div>
		{/each}
	</div>
	<Button
		class="ml-auto"
		type="submit"
		disabled={!all_approved}
		on:click={() => {
			dispatch('approve', { id: obj.id });
		}}>Approve</Button
	>
</form>
