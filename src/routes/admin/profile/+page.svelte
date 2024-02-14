<script lang="ts">
	import { edit_mode } from '$lib/utils/stores';
	import * as Table from '$lib/components/ui/table';
	// import type { LayoutData } from '../$types';
	import type { PageData } from './$types';
	import ChangePassword from './change-password.svelte';
	export let data: PageData;
	const { user, form } = data;
	const userKeys = ['name', 'email', 'organization', 'is_active', 'is_staff', 'approver'] as const;
</script>

{#if user}
	<!-- <div class="form-control items-start">
		<label class="label cursor-pointer gap-2">
			<input type="checkbox" class="toggle" bind:checked={$edit_mode} />
			<span class="label-text">Edit mode</span>
		</label>
	</div> -->

	<div class="max-w-lg">
		<Table.Root>
			<Table.Body>
				{#each userKeys as key}
					<Table.Row>
						<Table.Cell class="font-medium p-0.5">{key.toLocaleUpperCase()}</Table.Cell>
						<Table.Cell class="p-0.5">{user[key] ?? '-'}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<ChangePassword {form} user_id={user.id} />
{:else}
	<p>Invalid user</p>
{/if}
