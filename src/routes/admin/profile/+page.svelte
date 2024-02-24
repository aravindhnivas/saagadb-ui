<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { Check, Cross } from 'lucide-svelte/icons';
	import type { PageData } from './$types';
	import ChangePassword from './change-password.svelte';
	import { base } from '$app/paths';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	const userKeys = ['name', 'email', 'organization', 'approver_name'] as const;
	let verificationSent = false;

	async function resend_verification() {
		// return;
		if (verificationSent) return toast.info('Verification email already sent');
		verificationSent = false;
		const res = await fetch(`${base}/api/user/resend-verify-email`, {
			method: 'GET'
		});

		const data = (await res.json()) as {
			detail: string;
		};
		if (res.ok) {
			verificationSent = true;
			toast.success(data.detail);
		} else {
			verificationSent = false;
			toast.error(data.detail);
		}
	}
</script>

<div class="max-w-lg">
	<Table.Root>
		<Table.Body>
			{#each userKeys as key}
				<Table.Row>
					<Table.Cell class="font-medium p-0.5">{key.toLocaleUpperCase()}</Table.Cell>
					<Table.Cell class="p-0.5">{data.user[key] ?? '-'}</Table.Cell>
				</Table.Row>
			{/each}

			<Table.Row>
				<Table.Cell class="font-medium p-0.5">Account verified</Table.Cell>
				<Table.Cell class="p-0.5">
					{#if data.user.is_verified}
						<Check size="1.5em" />
					{:else}
						<div class="flex flex-col">
							<span>Not verified yet</span>
							{#if verificationSent}
								<span>Verification email sent</span>
							{:else}
								<button class="w-max hover:underline" on:click={resend_verification}
									>Send verification email</button
								>
							{/if}
						</div>
					{/if}
				</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</div>
<ChangePassword form={data.form_change_password} />
