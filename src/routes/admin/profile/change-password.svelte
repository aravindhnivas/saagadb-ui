<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import * as Form from '$lib/components/ui/form';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import schema from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { redirect } from '@sveltejs/kit';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

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
	opts={{ resetForm: import.meta.env.DEV }}
	let:config
	debug={import.meta.env.DEV}
	on:success={async () => {
		await goto(`${base}/logout`);
	}}
>
	<Form.Field {config} name="current_password" let:constraints let:attrs>
		<Form.Item>
			<Form.Label>Current password</Form.Label>
			<Form.Input type={show_password ? 'text' : 'password'} {...constraints} {...attrs.input} />
			<Form.Validation {...attrs.validation} />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="new_password" let:constraints let:attrs>
		<Form.Item>
			<Form.Label>New password</Form.Label>
			<Form.Input type={show_password ? 'text' : 'password'} {...constraints} {...attrs.input} />
			<Form.Validation {...attrs.validation} />
		</Form.Item>
	</Form.Field>

	<div class="flex gap-1 items-center p-2">
		<Checkbox bind:checked={show_password} />
		<span>Show password</span>
		<Form.Button class="ml-auto">Update password</Form.Button>
	</div>
</FormComponent>
