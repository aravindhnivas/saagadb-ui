<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import schema from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import AlertBox from '$lib/components/utils/alert-box.svelte';

	export let form: SuperValidated<typeof schema>;
	export let user_id: number;
</script>

<div class="alert p-2 my-2 w-max">Update your password below</div>

<FormComponent
	class="max-w-lg px-2"
	footer={false}
	{schema}
	{form}
	action="?/change_password&user_id={user_id}"
	opts={{ resetForm: true }}
	let:config
	debug={import.meta.env.DEV}
>
	<Form.Field {config} name="current_password">
		<Form.Item>
			<Form.Label>Current password</Form.Label>
			<Form.Input type={'password'} required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="new_password">
		<Form.Item>
			<Form.Label>New password</Form.Label>
			<Form.Input type={'password'} required />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button>Update password</Form.Button>
</FormComponent>
