<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import FetchMetaId from './fetch-meta-id.svelte';

	export let form: SuperValidated<(typeof Schemas)['line']>;

	const value = 'line';
	const schema = Schemas[value];
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	let:formStore
	let:formValues
	title="Line frequency"
	description="Enter the line details"
>
	<div class="grid gap-2 border-gray border-2 p-2 rounded-4">
		<FetchMetaId />
	</div>

	<Form.Field {config} name="meta">
		<Form.Item>
			<Form.Label>meta</Form.Label>
			<Form.Input required />
			<Form.Validation />
			<Form.Description>Please auto-fill this field using Fetch meta_id button</Form.Description>
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="qn_label_str">
		<Form.Item>
			<Form.Label>qn_label_str</Form.Label>
			<Form.Input required />
			<Form.Validation />
			<Form.Description
				>comma-separated string of quantum number labels. It must follow the order in which the
				quantum numbers are stated in the .cat file</Form.Description
			>
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="vib_qn">
		<Form.Item>
			<Form.Label>vib_qn</Form.Label>
			<Form.Input
				on:keyup={(e) => {
					formStore.update((f) => {
						f.contains_rovibrational = formValues.vib_qn.trim() !== '';
						return f;
					});
				}}
			/>
			<Form.Validation />
			<Form.Description>
				Indicates the quantum number label that corresponds to the vibrational quantum number. The
				quantum number label must be one of the values in qn_label_str
			</Form.Description>
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="contains_rovibrational">
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<div class="space-y-1 leading-none">
				<Form.Label>contains_rovibrational</Form.Label>
			</div>
			<Form.Checkbox checked={formValues.contains_rovibrational} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="cat_file">
		<Form.Item>
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Form.Label>cat_file</Form.Label>
				<Form.Input type="file" required />
			</div>
			<Form.Validation />
			<Form.Description
				>The <em>.cat</em> file to extract line information. Parsing of line information is done in the
				server which is largely based on molsim code.</Form.Description
			>
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="notes">
		<Form.Item>
			<Form.Label>notes</Form.Label>
			<Form.Textarea />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
</FormTabContents>
