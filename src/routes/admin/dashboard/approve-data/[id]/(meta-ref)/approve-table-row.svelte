<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import ApproveTableCell from './approve-table-cell.svelte';
	import { Button } from '$lib/components/ui/button';
	import { getContext } from 'svelte';
	import { edit_ref_field } from '../stores';
	export let obj: MetaReference;

	const approve_btn = getContext('approve_btn') as boolean;
	const include_keys = getContext('include_keys') as MetaRefApprovalItem[];
	const api_key = getContext('api_key') as string;

	let checked_row = include_keys.map(() => ({ checked: false }));
	$: all_approved = checked_row.every((f) => f.checked);
	let approve_all = false;
	$: console.log({ obj, include_keys, checked_row });
</script>

<Table.Row>
	{#if !$edit_ref_field}
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
	{/if}

	{#each include_keys as { key, is_link, formatter, editable }, ind (key)}
		{@const formatted_value = formatter?.(obj[key]) ?? obj[key]}
		<ApproveTableCell
			{key}
			is_link={is_link ?? false}
			{formatted_value}
			{editable}
			bind:value={obj[key]}
			bind:checked={checked_row[ind].checked}
		/>
	{/each}
	{#if approve_btn}
		<Table.Cell class="p-0.5 text-center">
			<Button
				formaction="?/approve&id={obj.id}&api_key={api_key}"
				type="submit"
				disabled={!all_approved && !$edit_ref_field}>Approve</Button
			>
		</Table.Cell>
	{/if}
</Table.Row>
