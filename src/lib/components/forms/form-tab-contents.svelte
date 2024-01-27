<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';
	import type { FormOptions, SuperValidated } from 'formsnap';
	import type { AnyZodObject } from 'zod';

	export let value: string;
	export let footer = true;
	export let title: string = '';
	export let description: string = '';
	export let form: SuperValidated<AnyZodObject>;
	export let schema: AnyZodObject;
	export let options: FormOptions<AnyZodObject> = {};

	let className = '';
	export { className as class };
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
		>
			<Card.Header>
				<Card.Title>{title || 'Upload config (.yaml) file'}</Card.Title>
				<Card.Description>
					<slot name="description">{description}</slot>
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2 {className}">
				<slot {config} {formStore} />
			</Card.Content>

			{#if footer}
				<Card.Footer class="justify-center">
					<slot name="footer">
						<Form.Button class="w-[150px]">Upload</Form.Button>
					</slot>
				</Card.Footer>
			{/if}
		</Form.Root>
	</Card.Root>
</Tabs.Content>
