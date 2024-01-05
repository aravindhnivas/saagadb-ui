<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import LinelistTable from './linelist-table.svelte';
	import { goto, invalidateAll } from '$app/navigation';

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

{#if data?.linelist.length > 0}
	<LinelistTable linelist={data.linelist} {openModal} />
{:else}
	<p>No linelist found</p>
{/if}

<form method="POST" action="?/update_table&id={id}&method={method}" use:enhance={onSubmit}>
	<dialog bind:this={modal} class="modal">
		<div class="modal-box gap-2">
			{#if method === 'PATCH'}
				<div class="">
					<h3 class="font-bold text-lg">New name</h3>
					<input
						value={changed_name}
						name="changed_name"
						type="text"
						placeholder="Type here"
						class="input input-sm w-full max-w-xs"
						required
					/>
				</div>
			{/if}

			<div class="">
				<h3 class="font-bold text-lg">{method === 'DELETE' ? 'delete' : 'change'} reason ?</h3>
				<input
					name="reason"
					type="text"
					placeholder="Type here"
					class="input input-sm w-full max-w-xs"
					required
				/>
			</div>

			<div class="modal-action">
				<form method="dialog">
					<button class="btn">Cancel</button>
				</form>
				<button type="submit" class="btn btn-{method === 'PATCH' ? 'warning' : 'error'}"
					>Submit</button
				>
			</div>
		</div>
	</dialog>
</form>
