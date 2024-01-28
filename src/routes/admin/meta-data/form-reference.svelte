<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	export let form: SuperValidated<(typeof Schemas)['reference']>;

	const value = 'reference';
	const schema = Schemas[value];
</script>

<FormTabContents {value} enctype="multipart/form-data" {schema} {form} let:config>
	<Form.Field {config} name="doi">
		<Form.Item>
			<Form.Label>doi</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="ref_url">
		<Form.Item>
			<Form.Label>ref_url</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="notes">
		<Form.Item>
			<Form.Label>notes</Form.Label>
			<Form.Textarea />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="bibtex">
		<Form.Item>
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Form.Label>bibtex</Form.Label>
				<Form.Input type="file" required={false} />
			</div>
			<Form.Validation />
		</Form.Item>
	</Form.Field>
</FormTabContents>
