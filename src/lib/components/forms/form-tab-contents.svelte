<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { AnyZodObject } from 'zod';
	// import MessageAlert from './message-alert.svelte';
	import { createEventDispatcher, setContext } from 'svelte';
	import Loader from '../utils/loader.svelte';

	export let value: string;
	export let footer = true;
	export let title: string = '';
	export let description: string = '';
	export let form: SuperValidated<AnyZodObject & Record<string, unknown>>;
	export let schema: AnyZodObject;
	export let debug = import.meta.env.DEV;
	export let enctype = 'multipart/form-data';
	let className = '';
	export { className as class };

	let error_message = '';

	const dispatch = createEventDispatcher();

	const superform = superForm(form, {
		validators: zodClient(schema),
		resetForm: false,
		// applyAction: false,
		invalidateAll: false,
		taintedMessage: null,
		onSubmit: () => {
			error_message = '';
		},
		onResult: ({ result }) => {
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
			console.error(e);
		}
	});

	const { form: formStore, enhance, submitting, posted, errors } = superform;
</script>

<Tabs.Content {value}>
	<Card.Root>
		<form use:enhance method="POST" {enctype}>
			<Card.Header>
				<Card.Title>{title || 'Upload config (.yaml) file'}</Card.Title>
				<Card.Description>
					<slot name="description">
						{description}
					</slot>
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2 {className}">
				<!-- <MessageAlert /> -->
				<slot form={superform} {formStore} />
			</Card.Content>

			{#if footer}
				<Card.Footer class="justify-center">
					<slot name="footer">
						<div class="flex gap-4 items-center">
							<Form.Button
								class="w-[150px]"
								disabled={$submitting}
								variant={error_message ? 'destructive' : 'default'}
							>
								{error_message ? 'Retry upload' : 'Upload'}
							</Form.Button>
							<Loader fetching={$submitting} description="uploading the data please wait..." />
						</div>
					</slot>
				</Card.Footer>
			{/if}
		</form>
	</Card.Root>
</Tabs.Content>

{#if debug}
	<SuperDebug data={$formStore} />
{/if}
