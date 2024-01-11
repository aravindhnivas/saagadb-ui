<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { type FormOptions, type SuperValidated } from 'formsnap';
	import { AlertCircle, CheckCheck, AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { z } from 'zod';
	// export let controlled = false;
	export let schema: z.AnyZodObject;
	export let form: SuperValidated<typeof schema>;
	export let options: FormOptions<typeof schema> = {};
	export let action = '';
	export let method = 'POST';

	let className = '';
	export { className as class };

	// console.log($$restProps);
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
	let:message
	enctype="multipart/form-data"
>
	{#if message && message.type && message.text}
		<Alert.Root variant={message.type === 'error' ? 'destructive' : 'default'}>
			{#if message.type === 'success'}
				<CheckCheck class="h-4 w-4" />
			{:else if message.type === 'warning'}
				<AlertTriangle class="h-4 w-4" />
			{:else if message.type === 'error'}
				<AlertCircle class="h-4 w-4" />
			{/if}
			<Alert.Title>{message.type}</Alert.Title>
			<Alert.Description>{@html message.text}</Alert.Description>
		</Alert.Root>
	{/if}

	<slot {config} />
	<slot name="footer">
		<Form.Button class="mt-2">Submit</Form.Button>
	</slot>
</Form.Root>
