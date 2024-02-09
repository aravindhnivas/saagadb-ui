<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import userSchema from './schema';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';

	export let data: PageData;
	let show_password = false;
</script>

{#if data.user?.is_superuser || data.user?.is_staff}
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

				<FormCombobox
					val_type="number"
					{config}
					name={'approver'}
					items={data.all_staff.map((f) => ({
						value: `${f.id}`,
						label: f.name
					}))}
				/>
			</Card.Content>
			<Card.Footer class="flex justify-center">
				<Form.Button class="w-[150px]">Submit</Form.Button>
			</Card.Footer>
		</Card.Root>
	</FormComponent>
{:else}
	<AlertBox message="Requires staff/superuser permission" title="Unauthorized" />
{/if}
