<script lang="ts">
	import type { PageData } from './$types';
	import linelistSchema from './schema';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import * as Form from '$lib/components/ui/form';

	export let data: PageData;
</script>

<FormComponent class="px-2" schema={linelistSchema} form={data.form} let:config>
	<Form.Field {config} name="linelist_name">
		<Form.Item class="max-w-md">
			<Form.Label>Name</Form.Label>
			<Form.Input />
			<Form.Description>Enter the name of the database</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
</FormComponent>
