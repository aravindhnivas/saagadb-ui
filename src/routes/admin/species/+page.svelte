<script lang="ts">
	import type { PageData } from './$types';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import * as Form from '$lib/components/ui/form';
	import { schemaSchema } from '$lib/utils/schemas/species';

	export let data: PageData;
</script>

<FormComponent class="p-2" schema={schemaSchema} form={data.form} let:config>
	{#each Object.keys(data.form.data) as name}
		<Form.Field {config} {name}>
			<Form.Item>
				<Form.Label>{name}</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/each}
</FormComponent>
