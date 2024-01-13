<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type FormOptions, type SuperValidated } from 'formsnap';
	import MessageAlert from './message-alert.svelte';
	import { z } from 'zod';
	// export let controlled = false;
	export let schema: z.AnyZodObject;
	export let form: SuperValidated<typeof schema>;
	export let options: FormOptions<typeof schema> = {};
	export let action = '';
	export let method = 'POST';
	export let footer = true;

	let className = '';
	export { className as class };
</script>

<Form.Root
	{...$$restProps}
	class={className}
	{method}
	{action}
	{options}
	{form}
	{schema}
	let:config
	enctype="multipart/form-data"
>
	<MessageAlert />

	<slot {config} />
	<slot name="footer">
		{#if footer}
			<Form.Button class="mt-2">Submit</Form.Button>
		{/if}
	</slot>
</Form.Root>
