<script lang="ts">
	import FetchMetaId from './fetch-meta-id.svelte';
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import FetchRefId from './fetch-ref-id.svelte';
	import FormField from '$lib/components/forms/form-field.svelte';

	export let form: SuperValidated<(typeof Schemas)['meta-reference']>;

	const value = 'meta-reference';
	const schema = Schemas[value];
</script>

<FormTabContents
	{value}
	{schema}
	{form}
	let:config
	title="Meta-reference"
	description="Link the uploaded reference (previous step) to the related species and add notes if any. "
>
	<div class="grid gap-2 border-gray border-2 p-2 rounded-4">
		<FetchMetaId />
		<FetchRefId />
	</div>

	<FormField
		{config}
		name="meta"
		description="Please auto-fill this field using Fetch meta_id button"
	/>
	<FormField
		{config}
		name="ref"
		description="Please auto-fill this field using Fetch ref_id button"
	/>
	<FormField {config} name="dipole_moment" checkbox />
	<FormField {config} name="spectrum" checkbox />
	<FormField {config} name="notes" textarea />
</FormTabContents>
