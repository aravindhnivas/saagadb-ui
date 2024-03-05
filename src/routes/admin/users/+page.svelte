<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import * as Table from '$lib/components/ui/table';
	import UserEditDialog from './user-edit-dialog.svelte';
	import { toast } from 'svelte-sonner';
	import AlertBox from '$lib/components/utils/alert-box.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: if (form && form.success) toast.success(form.message);
	$: if (form && !form.success) toast.error(form.message);

	console.log(form);
	const table_padding = 'p-0.5';
</script>

{#if data.user.is_superuser}
	<Table.Root class="max-w-4xl">
		<Table.Header>
			<Table.Row>
				{#each ['Name', 'Email', 'Admin', 'Superuser', 'Approver(s)'] as item}
					<Table.Head class="font-medium {table_padding}">{item}</Table.Head>
				{/each}
				<Table.Head class="{table_padding} text-center" />
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.all_users as user}
				<Table.Row>
					<Table.Cell class="font-medium {table_padding}">{user.name}</Table.Cell>
					<Table.Cell class={table_padding}>{user.email}</Table.Cell>
					<Table.Cell class="{table_padding} text-center">{user.is_staff ? '✅' : '❌'}</Table.Cell>
					<Table.Cell class="{table_padding} text-center">
						{user.is_superuser ? '✅' : '❌'}
					</Table.Cell>
					<Table.Cell class={table_padding}>{user.approver_name ?? '-'}</Table.Cell>
					<Table.Cell class="{table_padding} text-center">
						<UserEditDialog
							active_user={user}
							all_staffs={data.all_users.filter((f) => f.is_staff)}
						/>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{:else}
	<AlertBox
		title="Unauthorized"
		message="You are not authorized to view this page."
		variant="destructive"
	/>
{/if}
