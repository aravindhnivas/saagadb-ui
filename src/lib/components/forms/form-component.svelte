<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type FormOptions, type SuperValidated } from 'formsnap';
	import MessageAlert from './message-alert.svelte';
	import { type AnyZodObject } from 'zod';
	import Dropfile from '$lib/components/file-drop.svelte';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';

	export let schema: AnyZodObject;
	export let form: SuperValidated<AnyZodObject>;
	export let opts: FormOptions<AnyZodObject> = {};
	export let action = '';
	export let method = 'POST';
	export let footer = true;

	let className = '';
	export { className as class };

	let error_message = '';
	const options: FormOptions<AnyZodObject> = {
		// resetForm: true,
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				error_message = 'Please check the form above for errors';
			} else {
				error_message = '';
			}
		},
		onError: (e) => {
			// do something else
			console.error(e);
		},
		...opts
	};
</script>

<Form.Root
	{...$$restProps}
	class={className}
	{method}
	{action}
	{form}
	{schema}
	let:config
	enctype="multipart/form-data"
	{options}
>
	<MessageAlert />
	<Dropfile />

	<slot {config} />
	<slot name="footer">
		{#if footer}
			<Form.Button>Submit</Form.Button>
			{#if error_message}
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{error_message}</Alert.Description>
				</Alert.Root>
			{/if}
		{/if}
	</slot>
</Form.Root>
