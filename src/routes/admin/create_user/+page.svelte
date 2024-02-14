<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import userSchema from './schema';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';

	export let data: PageData;
	let show_password = false;
</script>

<FormComponent
	class="w-max"
	footer={false}
	schema={userSchema}
	form={data.form}
	let:config
	debug={import.meta.env.DEV}
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Create new user</Card.Title>
			<Card.Description
				>The email is just a unique identifier so it can be random (atleast for now)
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label>name</Form.Label>
					<Form.Input required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="email">
				<Form.Item>
					<Form.Label>email</Form.Label>
					<Form.Input type="email" required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

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

			<Form.Field {config} name="organization">
				<Form.Item>
					<Form.Label>organization</Form.Label>
					<Form.Input required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
			<div class="flex gap-4 items-center">
				<FormCombobox
					val_type="number"
					{config}
					name={'approver'}
					items={data.all_staff.map((f) => ({
						value: `${f.id}`,
						label: f.name
					}))}
				/>
				{#if data.user?.is_superuser}
					<Form.Field {config} name="is_staff">
						<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<Form.Checkbox />
							<div class="space-y-1 leading-none">
								<Form.Label>Admin privilege</Form.Label>
							</div>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				{/if}
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Form.Button class="w-[150px]">Submit</Form.Button>
		</Card.Footer>
	</Card.Root>
</FormComponent>
