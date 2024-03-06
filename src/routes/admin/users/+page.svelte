<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import UserEditDialog from './user-edit-dialog.svelte';
	import { toast } from 'svelte-sonner';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import type { OptionsColumns } from 'tabulator-tables';
	// import { Edit } from 'lucide-svelte/icons';

	export let data: PageData;
	export let form: ActionData;

	$: if (form && form.success) toast.success(form.message);
	$: if (form && !form.success) toast.error(form.message);
	let active_user: User;
	let dialog_open = false;
	// $: console.log(form);

	const columns: OptionsColumns['columns'] = [
		{
			title: 'Index',
			formatter: 'rownum',
			hozAlign: 'center'
		},
		{
			title: 'User ID',
			field: 'id',
			hozAlign: 'center'
		},
		{
			title: 'Name',
			field: 'name',
			width: 150,
			headerFilter: 'input'
		},
		{
			title: 'Email',
			field: 'email',
			headerFilter: 'input'
		},
		{
			title: 'Approver(s)',
			field: 'approver_name',
			sorter: 'array'
		},
		{
			title: 'Permissions',
			columns: [
				{
					title: 'Admin',
					field: 'is_staff',
					formatter: 'tickCross'
				},
				{
					title: 'Superuser',
					field: 'is_superuser',
					formatter: 'tickCross'
				}
			]
		},
		{
			title: 'Actions',
			columns: [
				{
					title: '',
					width: 100,
					formatter: () => 'Edit',
					hozAlign: 'center',
					cellClick: (e, cell) => {
						active_user = cell.getRow().getData() as User;
						dialog_open = true;
					}
				}
			]
		}
	];

	let table: Tabulator;

	const mount = (node: HTMLDivElement) => {
		table = new Tabulator(node, {
			index: 'email',
			pagination: true,
			paginationMode: 'local',
			paginationSize: 15,
			paginationSizeSelector: [10, 15, 25, 50, 100],
			paginationCounter: 'rows',
			movableColumns: true,
			// groupBy: 'approver_name',
			data: data.all_users,
			columns: columns
		});
	};
</script>

{#if data.user.is_superuser}
	{#key form}
		<div use:mount />
	{/key}
{:else}
	<AlertBox
		title="Unauthorized"
		message="You are not authorized to view this page."
		variant="destructive"
	/>
{/if}

<UserEditDialog
	bind:open={dialog_open}
	{active_user}
	all_staffs={data.all_users.filter((f) => f.is_staff)}
/>
