<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import type { FormPath } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import type { SuperForm } from 'sveltekit-superforms';

	type FieldProps<T extends Record<string, unknown>, U> = {
		form: SuperForm<T>;
		name: U;
		value?: string;
		textarea?: boolean;
		checkbox?: boolean;
		description?: string;
	};
	type $$Props = FieldProps<T, U>;

	export let form: SuperForm<T>;
	export let name: U;
	export let value: string = '';
	export let textarea = false;
	export let checkbox = false;
	export let description = '';
</script>

<Form.Field {form} {name} let:constraints>
	<Form.Control let:attrs>
		<slot {attrs} {constraints}>
			{#if textarea && typeof value === 'string'}
				<Form.Label>{name}</Form.Label>
				<Textarea {...attrs} {...constraints} bind:value />
			{:else if checkbox && typeof value === 'boolean'}
				<div class="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
					<div class="space-y-1 leading-none">
						<Form.Label>{name}</Form.Label>
					</div>
					<Checkbox {...attrs} {...constraints} bind:checked={value} />
				</div>
			{:else}
				<Form.Label>{name}</Form.Label>
				<Input {...attrs} {...constraints} bind:value />
			{/if}
		</slot>
	</Form.Control>
	{#if description}
		<Form.Description>{description}</Form.Description>
	{/if}
	<Form.FieldErrors />
</Form.Field>
