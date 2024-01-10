<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Form from '$lib/components/ui/form';
	import { type FormOptions, type SuperValidated } from 'formsnap';
	import { AlertCircle, CheckCheck, AlertTriangle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { z } from 'zod';

	export let schema: z.AnyZodObject;
	export let form: SuperValidated<typeof schema>;
	export let opts = {};
	export let action = '';

	const options: FormOptions<typeof schema> = {
		resetForm: true,
		onUpdated: ({ form }) => {
			if (form.valid) {
				toast.success('Species added!');
			}
		},
		onError: ({ result }) => {
			console.log(result);
		},
		...opts
	};
</script>

<Form.Root class="p-2" method="POST" {action} {options} {form} {schema} let:config let:message>
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
			<Alert.Description>{message.text}</Alert.Description>
		</Alert.Root>
	{/if}

	<slot {config} />
	<Form.Button>Submit</Form.Button>
</Form.Root>
