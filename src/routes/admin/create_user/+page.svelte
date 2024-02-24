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
	import FormInput from '$lib/components/forms/form-input.svelte';

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
			<Card.Description
				>Please verify email address before submitting the form.
				<br />
				An email will be sent to the user with a link to verify their email address.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<FormInput {config} name="name" />
			<FormInput {config} name="email" type="email" />
			<Form.Field {config} name="password">
				<Form.Item>
					<Form.Label>password</Form.Label>
					<!-- svelte-ignore a11y-interactive-supports-focus -->
					<div class="flex items-center gap-1">
						<Form.Input type={show_password ? 'text' : 'password'} required />
						<!-- svelte-ignore a11y-interactive-supports-focus -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<span class="cursor-pointer" on:click={() => (show_password = !show_password)}>
							{#if show_password}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</span>
					</div>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<FormInput {config} name="organization" />
			<div class="flex gap-4 items-end">
				<FormInput {config} name="approver" label="approvers" class="w-full" />
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
				<FormInput {config} name="is_staff" checkbox={true} label="Admin privilege" />
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
