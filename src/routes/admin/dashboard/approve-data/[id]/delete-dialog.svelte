<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';

	export let id: string | number;
	console.log('id', id);
	let delete_reason = '';
	const api_key = getContext('api_key') as string;
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<span class="text-red">REJECT</span>
	</Dialog.Trigger>
	<Dialog.Content class="max-w-[70%]  max-h-[70%] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>
				<span class="text-red">DELETE</span>
			</Dialog.Title>
			<Dialog.Description>This will delete the metadata from the database.</Dialog.Description>
		</Dialog.Header>
		<form use:enhance class="grid gap-4" action="?/reject&id={id}&api_key={api_key}" method="POST">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Reason ?</Label>
				<Input name="delete_reason" bind:value={delete_reason} class="col-span-3" required />
			</div>

			<Button
				class="w-[150px] ml-auto"
				type="submit"
				variant="destructive"
				on:click={(e) => {
					if (!delete_reason) {
						e.preventDefault();
						alert('Please provide a reason for deletion');
						return;
					}
					// console.log('delete_reason', delete_reason);
				}}
			>
				DELETE
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
