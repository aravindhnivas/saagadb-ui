<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { FormOptions, SuperValidated } from 'formsnap';
	import type { AnyZodObject } from 'zod';
	import MessageAlert from './message-alert.svelte';
	import AlertBox from '../utils/alert-box.svelte';
	import { createEventDispatcher } from 'svelte';

	export let value: string;
	export let footer = true;
	export let title: string = '';
	export let description: string = '';
	export let form: SuperValidated<AnyZodObject>;
	export let schema: AnyZodObject;
	export let opts: FormOptions<AnyZodObject> = {};
	export let show_message_alert = true;
	export let resetForm = true;
	let className = '';
	export { className as class };

	const dispatch = createEventDispatcher();
	// console.log(value);
	const options: FormOptions<typeof schema> = {
		resetForm,

		// when one form is submitted, the other forms’ data are lost. This is due to the page being invalidated by default on a successful response. If you want to preserve their data, you’d almost certainly want to set invalidateAll: false or applyAction: false on them.
		invalidateAll: true,
		applyAction: true,
		taintedMessage: null,
		onResult: ({ result }) => {
			// console.log(result);
			if (result.type === 'failure') {
				dispatch('failure', result);
			} else if (result.type === 'success') {
				dispatch('success', result);
			}
		},
		...opts
	};

	// $: console.log();
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
			let:submitting
			let:posted
			let:errors
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
				{#if show_message_alert}
					<MessageAlert />
				{/if}

				<slot {config} {formStore} {formValues} {submitting} {posted} {errors} />
				<!-- <pre>
					{JSON.stringify(errors, null, 2)}
				</pre> -->
				{#if !Object.values(errors).every((value) => value === undefined)}
					{#if errors._errors}
						<AlertBox variant="destructive" message={errors._errors.join(', ')} title="NOTE" />
					{:else if !show_message_alert}
						<AlertBox variant="destructive" message={JSON.stringify(errors)} title="NOTE" />
					{:else}
						<AlertBox
							variant="destructive"
							message="Please check above for error messages"
							title="Error"
						/>
					{/if}
				{/if}
			</Card.Content>

			{#if footer}
				<Card.Footer class="flex flex-col gap-4 justify-center">
					<slot name="footer">
						<Form.Button class="w-[150px] flex gap-4" disabled={submitting}>
							<span>{submitting ? 'Uploading...' : 'Upload'}</span>
							{#if submitting}
								<span class="loading loading-spinner"></span>
							{/if}
						</Form.Button>
						{#if submitting}
							<span class="text-sm"
								>Uploading will take a few minutes depending on the size of the file
							</span>
						{/if}
					</slot>
				</Card.Footer>
			{/if}
		</Form.Root>
	</Card.Root>
</Tabs.Content>
