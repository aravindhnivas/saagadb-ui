<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import FetchMetaId from './fetch-meta-id.svelte';
	import FormField from '$lib/components/forms/form-field.svelte';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	export let form: SuperValidated<(typeof Schemas)['line']>;

	const value = 'misc-files-upload';
	const schema = Schemas[value];
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	title="Misc. Files Upload"
	description="Upload miscellaneous files for species-metadata."
>
	<AlertBox
		message="This step is optional. Skip if you don't want to add any extra files to this species-metadata entry."
	/>

	<div class="grid gap-2 border-gray border-2 p-2 rounded-4">
		<FetchMetaId />
	</div>

	<FormField
		{config}
		name="meta"
		description="Please auto-fill this field using Fetch meta_id button"
	/>

	<!-- <FormField {config} name="name" description="Enter the name of the file" /> -->
	<Form.Field {config} name="misc_file" let:attrs let:constraints>
		<Form.Item>
			<div class="grid w-full max-w-sm items-center gap-1.5">
				<Form.Label>misc_file</Form.Label>
				<Form.Input type="file" {...constraints} {...attrs.input} multiple />
			</div>
			<Form.Validation {...attrs.validation} />
			<Form.Description>You can select more than one file(s)</Form.Description>
		</Form.Item>
	</Form.Field>
	<FormField {config} name="notes" textarea />
</FormTabContents>
