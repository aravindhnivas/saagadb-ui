<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Form from '$lib/components/ui/form';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import schema from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<typeof schema>;

	let show_password = false;
</script>

<div class="alert p-2 my-2 w-max">Update your password below</div>

<FormComponent
	class="max-w-lg px-2"
	footer={false}
	{schema}
	{form}
	action="?/change_password"
	opts={{ resetForm: true }}
	let:config
	debug={import.meta.env.DEV}
>
	<Form.Field {config} name="current_password">
		<Form.Item>
			<Form.Label>Current password</Form.Label>
			<Form.Input type={show_password ? 'text' : 'password'} required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="new_password">
		<Form.Item>
			<Form.Label>New password</Form.Label>
			<Form.Input type={show_password ? 'text' : 'password'} required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<div class="flex gap-1 items-center p-2">
		<Checkbox bind:checked={show_password} />
		<span>Show password</span>
		<Form.Button class="ml-auto">Update password</Form.Button>
	</div>
</FormComponent>
