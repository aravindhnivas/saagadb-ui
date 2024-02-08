<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { FormOptions, SuperValidated } from 'formsnap';
	import type { AnyZodObject } from 'zod';
	import MessageAlert from './message-alert.svelte';
	import Dropfile from '$lib/components/file-drop.svelte';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
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
	export let include_dropfile = true;

	let className = '';
	export { className as class };

	let submitting = false;
	let error_message = '';
	const dispatch = createEventDispatcher();
	const options: FormOptions<typeof schema> = {
		resetForm: false,
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
			debug={import.meta.env.DEV}
		>
			<Card.Header>
				<Card.Title>{title || 'Upload config (.yaml) file'}</Card.Title>
				<Card.Description>
					<slot name="description">
						{description}
					</slot>
					{#if include_dropfile}
						<Dropfile />
					{/if}
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2 {className}">
				<MessageAlert />

				<slot {config} {formStore} />

				{#if error_message}
					<AlertBox message={error_message} variant="destructive" />
				{/if}
			</Card.Content>

			{#if footer}
				<Card.Footer class="justify-center">
					<slot name="footer">
						<div class="flex gap-4 items-center">
							<Form.Button class="w-[150px]" disabled={submitting}>Upload</Form.Button>
							<Loader fetching={submitting} description="uploading the data please wait..." />
						</div>
					</slot>
				</Card.Footer>
			{/if}
		</Form.Root>
	</Card.Root>
</Tabs.Content>
