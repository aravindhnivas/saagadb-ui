<script lang="ts">
	import type { PageData } from './$types';
	import { linelistSchema } from '$lib/utils/schemas';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import * as Form from '$lib/components/ui/form';
	import { type FormOptions } from 'formsnap';
	import { toast } from 'svelte-sonner';

	export let data: PageData;

	const options: FormOptions<typeof linelistSchema> = {
		// resetForm: true,
		onResult: ({ result }) => {
			const { form, ...rest } = result?.data;
			if (form.valid) {
				toast.success('Species added!');
			}
		}
	};
</script>

<FormComponent class="p-2" schema={linelistSchema} form={data.form} let:config {options}>
	<Form.Field {config} name="linelist_name">
		<Form.Item class="max-w-md">
			<Form.Label>Name</Form.Label>
			<Form.Input />
			<Form.Description>Enter the name of the database</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
</FormComponent>
