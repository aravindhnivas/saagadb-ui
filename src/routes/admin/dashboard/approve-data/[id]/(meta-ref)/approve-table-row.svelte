<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import ApproveTableCell from './approve-table-cell.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	export let obj: MetaReference;

	const approve_btn = getContext('approve_btn') as boolean;
	const include_keys = getContext('include_keys') as {
		key: keyof SpeciesMetadata;
		label: string;
		formatter?: <T>(val: T) => string;
		is_link?: boolean;
		href?: string;
	}[];

	const api_key = getContext('api_key') as string;

	// const onSubmit = () => {
	// 	return async ({ result }) => {
	// 		console.log(result);
	// 		if (result.type === 'success') {
	// 			// rerun all `load` functions, following the successful update
	// 			await invalidateAll();
	// 			// console.log(result);
	// 			const { data } = result;
	// 			if (data.success) {
	// 				toast.success(data.message);
	// 			} else {
	// 				message = data.message?.detail || data.message;
	// 				toast.error(message);
	// 			}
	// 		}
	// 		await applyAction(result);
	// 	};
	// };

	let checked_row = include_keys.map((k) => ({
		key: k.key,
		is_link: k.is_link,
		value: k.formatter?.(obj[k.key]) ?? obj[k.key],
		checked: false
	}));

	$: all_approved = checked_row.every((f) => f.checked);
	let approve_all = false;
</script>

<Table.Row>
	<Table.Cell class="p-0.5 text-center">
		<div class="flex flex-col gap-4 items-center">
			<span>All</span>
			<Checkbox
				bind:checked={approve_all}
				onCheckedChange={(state) => {
					if (state === 'indeterminate') return;
					checked_row = checked_row.map((f) => ({ ...f, checked: state }));
				}}
			/>
		</div>
	</Table.Cell>
	{#each checked_row as { value, is_link, checked }}
		<ApproveTableCell is_link={is_link ?? false} {value} bind:checked />
	{/each}
	{#if approve_btn}
		<Table.Cell class="p-0.5 text-center">
			<form use:enhance action="?/approve&id={obj.id}&api_key={api_key}" method="POST">
				<Button type="submit" disabled={!all_approved}>Approve</Button>
			</form>
		</Table.Cell>
	{/if}
</Table.Row>
