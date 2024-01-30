<script lang="ts">
	import type { PageData } from './$types';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import Dropfile from '$lib/components/file-drop.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import speciesSchema from '$lib/schemas/species';
	import AutoFillInchi from './auto-fill-inchi.svelte';
	import AutoFillName from './auto-fill-name.svelte';
	import NameHtml from './name-html.svelte';
	export let data: PageData;
</script>

<FormComponent
	class="max-w-4xl"
	footer={false}
	schema={speciesSchema}
	form={data.form}
	let:config
	let:formStore
	debug={import.meta.env.DEV}
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Upload new species</Card.Title>
			<Card.Description><Dropfile /></Card.Description>
		</Card.Header>
		<Card.Content>
			{#each Object.keys(data.form.data) as name}
				{#if name === 'name'}
					<AutoFillName />
				{/if}
				<Form.Field {config} {name}>
					<Form.Item>
						<Form.Label>{name}</Form.Label>
						{#if name === 'notes'}
							<Form.Textarea />
						{:else if name === 'smiles'}
							<div class="grid grid-cols-6 gap-4 items-start">
								<Form.Input required class="col-span-2" />
								<AutoFillInchi />
							</div>
							<span class="text-sm text-gray-500"
								>Write isotopes mass within "[]" i.e., [15N] and connected hydrogens must be
								specified inside brackets i.e., [15NH].
							</span>
						{:else if name === 'name_html'}
							<div class="grid grid-cols-4 gap-4 items-center">
								<Form.Input required class="col-span-3" />
								<NameHtml />
							</div>
						{:else}
							<Form.Input required />
						{/if}
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/each}
		</Card.Content>
		<Card.Footer class="flex gap-4 justify-center">
			<Form.Button class="w-[150px]">Submit</Form.Button>
		</Card.Footer>
	</Card.Root>
</FormComponent>
