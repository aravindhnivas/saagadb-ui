<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Tiptap from '$lib/components/Tiptap.svelte';
	import { createEventDispatcher } from 'svelte';

	export let config: any;
	export let name: string;
	export let label: string = '';
	export let description: string = '';
	export let textarea = false;
	export let checkbox = false;
	const disatch = createEventDispatcher();
</script>

<Form.Field {config} {name} let:constraints let:attrs let:setValue let:value>
	{#if checkbox}
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<div class="space-y-1 leading-none">
				<Form.Label {...attrs.label}>
					{@html label || name}
					<slot name="name" />
				</Form.Label>
			</div>
			<Form.Checkbox
				{...constraints}
				{...attrs.input}
				onCheckedChange={(state) => {
					disatch('change', {
						name,
						value: state
					});
				}}
			/>
			<Form.Validation {...attrs.validation} />
		</Form.Item>
	{:else}
		<Form.Item>
			{#if textarea}
				<Form.Label {...attrs.label}>
					<span>{@html label || name}</span>
					<slot name="name" />
				</Form.Label>
				<Form.Textarea hidden {...constraints} {...attrs.input} />
				<Tiptap {setValue} on:change content={value} />
			{:else}
				<Form.Label {...attrs.label}>
					<span>{@html label || name}</span>
					<slot name="name" />
				</Form.Label>
				<Form.Input {...constraints} {...attrs.input} on:keyup on:change />
			{/if}
			<Form.Validation {...attrs.validation} />
			{#if description || $$slots.description}
				<Form.Description {...attrs.description}>
					<slot name="description">
						{description}
					</slot>
				</Form.Description>
			{/if}
		</Form.Item>
	{/if}
</Form.Field>
