<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { enhance } from '$app/forms';
	import { LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';
	import CustomDropdown from '$lib/components/custom-dropdown.svelte';
	import FormCheckbox from '$lib/components/forms/form-checkbox.svelte';

	export let active_user: User;
	export let all_staffs: User[] = [];
	export let open = false;

	let checked_row: {
		label: string;
		name: keyof User;
		disabled: boolean;
	}[] = [
		{ label: 'Name', name: 'name', disabled: true },
		{ label: 'Email', name: 'email', disabled: true },
		{ label: 'Admin', name: 'is_staff', disabled: true },
		{ label: 'Approver(s)', name: 'approver', disabled: true }
	];
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<form action="?/update_user&id={active_user.id}" method="POST" use:enhance>
			<Dialog.Header>
				<Dialog.Title>Edit {active_user.name}</Dialog.Title>
				<Dialog.Description>
					<span class="flex gap-2 items-center">
						<span>Click on </span>
						<LockKeyhole />
						<span>to unlock </span>
						<UnlockKeyhole />
						<span> the field for editing.</span>
					</span>
				</Dialog.Description>
			</Dialog.Header>
			{#if active_user}
				<div class="grid-auto-fill select-none">
					{#each checked_row as { label, name, disabled }}
						<div class="flex flex-col gap-1">
							<div class="flex gap-4 items-center p-2">
								<button
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
								<Label for={name}>{label}</Label>
							</div>

							{#if typeof active_user[name] === 'boolean'}
								<FormCheckbox {disabled} {name} checked={active_user[name]} />
							{:else}
								<Input {disabled} value={active_user[name]} {name} />
							{/if}
							{#if name === 'approver' && !disabled}
								<CustomDropdown
									label="Approver(s)"
									items={all_staffs.map((user) => ({
										label: user.name,
										value: user.id,
										checked: active_user.approver.includes(user.id)
									}))}
									bind:selected_values={active_user[name]}
								/>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
			<Dialog.Footer class="my-2">
				<Button on:click={() => (open = false)} type="submit">Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
