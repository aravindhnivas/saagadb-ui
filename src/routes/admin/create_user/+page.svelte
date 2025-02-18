<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte/icons';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import userSchema from './schema';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { tick } from 'svelte';
	import FormField from '$lib/components/forms/form-field.svelte';
	export let data: PageData;

	let show_password = false;
	let approvers = data.all_staff.map((f) => ({
		value: `${f.id}`,
		label: f.name,
		checked: false
	}));
</script>

<FormComponent
	class="w-max"
	footer={false}
	schema={userSchema}
	form={data.form}
	let:config
	let:formStore
	let:submitting
	debug={import.meta.env.DEV}
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Create new user</Card.Title>
			<Card.Description>
				An email will be sent to the user with a link to verify their email address.
				<br />
				Please verify the email link to start uploading items to database.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<FormField {config} name="name" />
			<FormField {config} name="email" />
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>password</Form.Label>
					<div class="relative h-10 w-full" style="z-index: 0;">
						<Form.Input
							type={show_password ? 'text' : 'password'}
							required
							class="pl-10 pr-3 py-2 text-md w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
						/>
						<button on:click|preventDefault={() => (show_password = !show_password)}>
							{#if show_password}
								<Eye
									class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
								/>
							{:else}
								<EyeOff
									class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
								/>
							{/if}
						</button>
					</div>

					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<FormField {config} name="organization" />
			<div class="flex gap-4 items-end">
				<FormField {config} name="approver" label="approvers" />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" builders={[builder]} class="mb-2">Select approvers</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Label>Approvers</DropdownMenu.Label>
						<DropdownMenu.Separator />
						{#each approvers as item}
							<DropdownMenu.CheckboxItem
								bind:checked={item.checked}
								onCheckedChange={async (e) => {
									await tick();
									const selected_approvers = approvers.filter((f) => f.checked).map((f) => f.value);
									formStore.update((f) => {
										f.approver = selected_approvers.join(',');
										return f;
									});
									// setValue(selected_approvers);
								}}
							>
								{item.label}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>

			{#if data.user?.is_superuser}
				<FormField {config} name="is_staff" checkbox={true} label="Admin privilege" />
			{/if}
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Form.Button class="w-[150px] flex gap-4" disabled={submitting}>
				<span>Submit</span>
				{#if submitting}
					<span class="loading loading-spinner"></span>
				{/if}
			</Form.Button>
		</Card.Footer>
	</Card.Root>
</FormComponent>
