<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;
	let id: string;
	let method: 'PATCH' | 'DELETE' = 'PATCH';
	let changed_name: string = '';
	let modal: HTMLDialogElement;

	const openModal = (line_id: string, update_type: 'PATCH' | 'DELETE', name: string = '') => {
		method = update_type;
		id = line_id;
		changed_name = name;
		modal?.showModal();
	};
	console.log({ data });
	const onSubmit = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();
				console.log(result);
				if (result?.data?.success) {
					toast.success('Updated successfully');
				} else {
					const msg = result?.data?.message;
					toast.error(`Error deleting linelist: ${msg?.detail ?? msg}`);
				}
			}

			if (result.type === 'redirect') {
				goto(result.location);
			} else {
				await applyAction(result);
			}

			modal?.close();
		};
	};
</script>

<div class="max-w-sm">
	{#if data?.linelist.length > 0}
		<Table.Root>
			<Table.Caption>Available linelist</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px] text-center">Name</Table.Head>
					<Table.Head class="text-right" />
					<Table.Head class="text-right" />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.linelist as { id, linelist_name } (id)}
					<Table.Row>
						<Table.Cell class="font-medium text-center">{linelist_name}</Table.Cell>
						<Table.Cell class="text-center"
							><Button variant="outline" on:click={() => openModal(id, 'PATCH', linelist_name)}
								>EDIT</Button
							></Table.Cell
						>
						<Table.Cell class="text-center"
							><Button variant="destructive" on:click={() => openModal(id, 'DELETE')}>DELETE</Button
							></Table.Cell
						>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<p>No linelist found</p>
	{/if}
</div>

<form method="POST" action="?/update_table&id={id}&method={method}" use:enhance={onSubmit}>
	<dialog bind:this={modal} class="modal">
		<div class="modal-box gap-2">
			<div class="grid gap-4 py-4">
				{#if method === 'PATCH'}
					<div class="grid grid-cols-4 items-center gap-4">
						<Label class="text-right">New name</Label>
						<Input name="changed_name" value={changed_name} class="col-span-3" required />
					</div>
				{/if}
				<div class="grid grid-cols-4 items-center gap-4">
					<Label class="text-right">Reason ?</Label>
					<Input name="reason" value="" class="col-span-3" required />
				</div>
			</div>

			<div class="modal-action">
				<form method="dialog">
					<Button type="submit">Cancel</Button>
				</form>
				<Button type="submit" variant={method === 'PATCH' ? 'outline' : 'destructive'}
					>Submit</Button
				>
			</div>
		</div>
	</dialog>
</form>
