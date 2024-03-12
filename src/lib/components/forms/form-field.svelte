<script lang="ts">
	import * as Form from '$lib/components/ui/form';

	export let config: any;
	export let name: string;
	export let label: string = '';
	export let description: string = '';
	export let textarea = false;
	export let checkbox = false;
</script>

<Form.Field {config} {name} let:constraints let:attrs>
	{#if checkbox}
		<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
			<div class="space-y-1 leading-none">
				<Form.Label {...attrs.label}>{@html label || name}</Form.Label>
			</div>
			<Form.Checkbox {...constraints} {...attrs.input} />
			<Form.Validation {...attrs.validation} />
		</Form.Item>
	{:else}
		<Form.Item>
			<Form.Label {...attrs.label}>{@html label || name}</Form.Label>
			{#if textarea}
				<Form.Textarea {...constraints} {...attrs.input} />
			{:else}
				<Form.Input {...constraints} {...attrs.input} on:keyup />
			{/if}
			<Form.Validation {...attrs.validation} />
			{#if description}
				<Form.Description {...attrs.description}>{description}</Form.Description>
			{/if}
		</Form.Item>
	{/if}
</Form.Field>
