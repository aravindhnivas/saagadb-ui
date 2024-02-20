<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { Delete, Edit } from 'lucide-svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';

	export let data: PageData;
	let id: string;
	let method: 'PATCH' | 'DELETE' = 'PATCH';
	let changed_name: string = '';
	let modal: HTMLDialogElement;

	const openModal = (line_id: string, update_type: 'PATCH' | 'DELETE', name: string = '') => {
		if (!(line_id && update_type)) return toast.error('Missing required parameters');
		id = line_id;
		method = update_type;
		if (name) changed_name = name;
		modal?.showModal();
	};

	let message: string;
	const onSubmit = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();
				console.log(result);
				const { data } = result;
				if (data.success) {
					toast.success(data.message);
				} else {
					message = data.message?.detail || data.message;
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

{#if message}
	<AlertBox message={JSON.stringify(message)} />
{/if}

{#if data?.linelist.length > 0}
	<Table.Root class="w-[200px]">
		<Table.Caption>Available linelist</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head />
				<Table.Head />
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.linelist as { id, linelist_name } (id)}
				<Table.Row>
					<Table.Cell class="font-medium p-1">{linelist_name}</Table.Cell>
					<Table.Cell class="p-1"
						><button on:click={() => openModal(id, 'PATCH', linelist_name)}><Edit /></button
						></Table.Cell
					>
					<Table.Cell class="p-1"
						><button class="text-red" on:click={() => openModal(id, 'DELETE', linelist_name)}
							><Delete /></button
						></Table.Cell
					>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<p>No linelist found</p>
{/if}

<form method="POST" action="?/update_table&id={id}&method={method}" use:enhance={onSubmit}>
	<dialog bind:this={modal} class="modal">
		<div class="modal-box gap-2">
			<h3 class="font-bold text-lg">
				{method === 'DELETE' ? 'Deleting: ' : 'Updating: '}{changed_name}
			</h3>
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
