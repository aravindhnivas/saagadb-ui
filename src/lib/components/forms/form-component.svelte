<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type FormOptions, type SuperValidated } from 'formsnap';
	import MessageAlert from './message-alert.svelte';
	import { type AnyZodObject } from 'zod';
	import { AlertCircle } from 'lucide-svelte/icons';
	import * as Alert from '$lib/components/ui/alert';
	import { createEventDispatcher } from 'svelte';
	import { get } from 'svelte/store';

	export let schema: AnyZodObject;
	export let form: SuperValidated<AnyZodObject>;
	export let opts: FormOptions<AnyZodObject> = {};
	export let action = '';
	export let method = 'POST';
	export let footer = true;
	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher();
	let error_message = '';
	const options: FormOptions<AnyZodObject> = {
		// resetForm: true,
		onResult: ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				dispatch('success', { result });
				error_message = '';
			} else if (result.type === 'failure') {
				error_message = result.data?.form?.errors?.detail?.[0];
				console.error({ error_message });
			}
		},
		onError: ({ result, message }) => {
			// do something else
			console.error({ message: get(message), result });
			error_message = result?.error?.message;
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
	let:formStore
	let:submitting
	let:posted
	enctype="multipart/form-data"
	{options}
>
	<MessageAlert />

	<slot {config} {formStore} {submitting} {posted} />
	<slot name="footer">
		{#if footer}
			<Form.Button class="w-[150px] flex gap-4" disabled={submitting}>
				<span>Submit</span>
				{#if submitting}
					<span class="loading loading-spinner"></span>
				{/if}
			</Form.Button>
		{/if}
	</slot>

	{#if error_message}
		<Alert.Root class="my" variant="destructive">
			<AlertCircle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{error_message}</Alert.Description>
		</Alert.Root>
	{/if}
</Form.Root>
