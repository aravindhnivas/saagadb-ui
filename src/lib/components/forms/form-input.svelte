<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { AnyZodObject } from 'zod';
	export let name: string;
	export let label: string = '';
	export let config: {
		form: SuperForm<AnyZodObject>;
		schema: AnyZodObject;
	};
	let className = '';
	export { className as class };

	export let checkbox = false;
	export let textarea = false;
</script>

<Form.Field {config} {name} let:constraints let:attrs>
	<Form.Item
		class="{checkbox
			? 'flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'
			: ''} {className}"
	>
		{#if textarea}
			<Form.Label>{label || name}</Form.Label>
			<Form.Textarea {...constraints} {...attrs} {...$$restProps} />
		{:else if checkbox}
			<Form.Checkbox />
			<div class="space-y-1 leading-none">
				<Form.Label>{label || name}</Form.Label>
			</div>
		{:else}
			<Form.Label>{label || name}</Form.Label>
			<Form.Input {...constraints} {...attrs} {...$$restProps} />
		{/if}
		<Form.Validation />
	</Form.Item>
</Form.Field>
