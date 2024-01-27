<script lang="ts">
	import type { PageData } from './$types';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import Dropfile from '$lib/components/file-drop.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import speciesSchema from '$lib/schemas/species';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;
</script>

<FormComponent
	class="max-w-4xl"
	footer={false}
	schema={speciesSchema}
	form={data.form}
	let:config
	debug={import.meta.env.DEV}
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Upload new species</Card.Title>
			<Card.Description><Dropfile /></Card.Description>
		</Card.Header>
		<Card.Content>
			{#each Object.keys(data.form.data) as name}
				<Form.Field {config} {name}>
					<Form.Item>
						<Form.Label>{name}</Form.Label>
						<Form.Input />
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/each}
		</Card.Content>
		<Card.Footer class="flex gap-4 justify-center">
			<Button variant="outline" class="w-[100px]">Auto fill</Button>
			<Form.Button class="w-[150px]">Submit</Form.Button>
		</Card.Footer>
	</Card.Root>
</FormComponent>
