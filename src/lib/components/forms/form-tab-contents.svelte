<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { FormOptions, SuperValidated } from 'formsnap';
	import type { AnyZodObject } from 'zod';
	import MessageAlert from './message-alert.svelte';
	import { createEventDispatcher } from 'svelte';
	import Loader from '../utils/loader.svelte';
	import AlertBox from '../utils/alert-box.svelte';

	export let value: string;
	export let footer = true;
	export let title: string = '';
	export let description: string = '';
	export let form: SuperValidated<AnyZodObject>;
	export let schema: AnyZodObject;
	export let opts: FormOptions<AnyZodObject> = {};

	let className = '';
	export { className as class };

	let submitting = false;
	let error_message = '';
	const dispatch = createEventDispatcher();
	const options: FormOptions<typeof schema> = {
		resetForm: true,
		// applyAction: false,
		invalidateAll: false,
		taintedMessage: null,
		onSubmit: () => {
			error_message = '';
			submitting = true;
		},
		onResult: ({ result }) => {
			submitting = false;
			dispatch('result', result);
			console.log(result);
			if (result.type === 'failure') {
				error_message = 'Please check the form above for errors';
			} else {
				error_message = '';
			}
		},
		onError: (e) => {
			dispatch('error', e);
			// do something else
			console.error(e);
			error_message = e.result?.error?.message;
		},
		...opts
	};
</script>

<Tabs.Content {value}>
	<Card.Root>
		<Form.Root
			style="max-height: calc(100vh - 15rem); overflow: auto;"
			{form}
			{schema}
			{options}
			{...$$restProps}
			let:config
			let:formStore
			let:formValues
			debug={import.meta.env.DEV}
		>
			<Card.Header>
				<Card.Title>{title || 'Upload config (.yaml) file'}</Card.Title>
				<Card.Description>
					<slot name="description">
						{description}
					</slot>
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2 {className}">
				<MessageAlert />

				<slot {config} {formStore} {formValues} />
			</Card.Content>

			{#if footer}
				<Card.Footer class="justify-center">
					<slot name="footer">
						<Form.Button class="w-[150px] flex gap-4" disabled={submitting}>
							<span>{submitting ? 'Uploading...' : 'Upload'}</span>
							{#if submitting}
								<span class="loading loading-spinner"></span>
							{/if}
						</Form.Button>
					</slot>
				</Card.Footer>
			{/if}

			{#if error_message}
				<AlertBox variant="destructive" message={error_message} />
			{/if}
		</Form.Root>
	</Card.Root>
</Tabs.Content>
