<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import LinelistTable from './linelist-table.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	export let data: PageData;
	let id: string;
	let modal: HTMLDialogElement;
	const openModal = (line_id: string) => {
		id = line_id;
		modal?.showModal();
	};

	const onSubmit = () => {
		return async ({ result }) => {
			console.log(result);

			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();

				if (result?.data?.success) {
					toast.success('Deleted successfully');
				} else {
					toast.error(`Error deleting linelist: ${result?.data?.message?.detail}`);
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

<form method="POST" use:enhance={onSubmit}>
	<dialog bind:this={modal} id="delete-dialog-modal" class="modal">
		<div class="modal-box gap-2">
			<h3 class="font-bold text-lg">delete reason ?</h3>
			<input
				name="delete_reason"
				type="text"
				placeholder="Type here"
				class="input input-sm w-full max-w-xs"
				required
			/>

			<div class="modal-action">
				<form method="dialog">
					<!-- if there is a button in form, it will close the modal -->
					<button class="btn">Cancel</button>
				</form>
				<button formaction="?/delete_table&id={id}" class="btn btn-error">Submit</button>
			</div>
		</div>
	</dialog>
</form>
