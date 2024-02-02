<script lang="ts">
	import FetchMetaId from './fetch-meta-id.svelte';
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import FetchRefId from './fetch-ref-id.svelte';
	export let form: SuperValidated<(typeof Schemas)['meta-reference']>;

	const value = 'meta-reference';
	const schema = Schemas[value];
</script>

<FormTabContents
	{value}
	{schema}
	{form}
	let:config
	include_dropfile={false}
	title="Meta-reference"
	description="Enter the meta-reference details"
>
	<div class="grid gap-2 border-gray border-2 p-2 rounded-4">
		<FetchMetaId />
		<FetchRefId />
	</div>

	<Form.Field {config} name="meta">
		<Form.Item>
			<Form.Label>meta</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="ref">
		<Form.Item>
			<Form.Label>ref</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="dipole_moment">
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<div class="space-y-1 leading-none">
				<Form.Label>Dipole moment</Form.Label>
			</div>
			<Form.Checkbox checked="indeterminate" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="spectrum">
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<div class="space-y-1 leading-none">
				<Form.Label>Spectrum</Form.Label>
			</div>
			<Form.Checkbox checked="indeterminate" />
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
</FormTabContents>
