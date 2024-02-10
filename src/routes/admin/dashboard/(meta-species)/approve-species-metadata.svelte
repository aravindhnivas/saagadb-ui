<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { LockKeyhole, UnlockKeyhole } from 'lucide-svelte';

	export let obj: SpeciesMetadata;

	const api_key = 'species-metadata';

	let checked_row = [
		{ name: 'species_name', checked: false, disabled: true },
		{ name: 'species_formula', checked: false, disabled: true },
		{ name: 'category', checked: false, disabled: true },
		{ name: 'hyperfine', checked: false, disabled: true },
		{ name: 'linelist_name', checked: false, disabled: true },
		{ name: 'degree_of_freedom', checked: false, disabled: true },
		{ name: 'molecule_tag', checked: false, disabled: true },
		{ name: 'mu_a', checked: false, disabled: true },
		{ name: 'mu_b', checked: false, disabled: true },
		{ name: 'mu_c', checked: false, disabled: true },
		{ name: 'a_const', checked: false, disabled: true },
		{ name: 'b_const', checked: false, disabled: true },
		{ name: 'c_const', checked: false, disabled: true },
		{ name: 'data_date', checked: false, disabled: true },
		{ name: 'data_contributor', checked: false, disabled: true },
		{ name: 'notes', checked: false, disabled: true }
	] as { name: keyof SpeciesMetadata; checked: boolean; disabled: boolean }[];
	// $: console.log(checked_row);
	$: all_approved = checked_row.every((f) => f.checked);
	let approve_all = false;
</script>

<div class="flex gap-4 items-center p-2">
	<Label>Select all to approve</Label>
	<Checkbox
		bind:checked={approve_all}
		onCheckedChange={(state) => {
			if (state === 'indeterminate') return;
			checked_row = checked_row.map((f) => ({ ...f, checked: state }));
		}}
	/>
</div>

<div class="grid-auto-fill">
	{#each checked_row as { name, checked, disabled }}
		<div class="flex flex-col">
			<div class="flex gap-4 items-center p-2">
				<button on:click={() => (disabled = !disabled)}>
					{#if disabled}
						<LockKeyhole />
					{:else}
						<UnlockKeyhole />
					{/if}
				</button>
				<Label>{name}</Label>
				<Checkbox bind:checked />
			</div>
			{#if name === 'notes'}
				<Textarea {disabled} value={obj[name]} class="w-100" />
			{:else}
				<Input {disabled} value={obj[name]} />
			{/if}
		</div>
	{/each}
</div>

<form class="ml-auto" use:enhance action="?/approve&id={obj.id}&api_key=${api_key}" method="POST">
	<Button type="submit" disabled={!all_approved}>Approve</Button>
</form>
