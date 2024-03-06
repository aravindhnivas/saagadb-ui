<script lang="ts">
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import * as Table from '$lib/components/ui/table';
	import { base } from '$app/paths';
	export let fetch_approving_users: Promise<User[]>;
</script>

{#await fetch_approving_users}
	<Loader fetching={true} />
{:then approving_users}
	{#if approving_users?.length > 0}
		<Table.Root class="text-md max-w-2xl">
			<Table.Body>
				{#each approving_users as approving_user, ind}
					<Table.Row>
						<Table.Cell class="p-0.5">{ind + 1}</Table.Cell>
						<Table.Cell class="font-medium p-0.5">
							<a
								href="{base}/admin/dashboard/approve-data/{approving_user.id}"
								class="hover:underline">{approving_user.name}</a
							>
						</Table.Cell>
						<Table.Cell class="p-0.5">{approving_user.email}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{:else}
		<span>No approving users</span>
	{/if}
{:catch error}
	<AlertBox {error} />
{/await}
