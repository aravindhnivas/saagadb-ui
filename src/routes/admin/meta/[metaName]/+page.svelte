<script lang="ts">
	import type { PageData } from './$types';
	import Dropfile from '$lib/components/dropfile.svelte';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import { schemas } from '$lib/utils/schemas/meta';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import type { FormOptions, SuperValidated } from 'formsnap';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	export let data: PageData;

	const check_key_to_include = (key: string) => {
		const arr_file_input = data.fileInput?.map((f) => f.name);
		const arr_dropdown = data.dropdown?.map((f) => f.name);
		const arr = new Set([...arr_file_input, ...arr_dropdown]);
		return !arr.has(key);
	};

	let schema: (typeof schemas)[number];
	let form: SuperValidated<typeof schema>;
	let options: FormOptions<typeof schema>;

	onMount(() => {
		console.log(form);
		// $: if (data.form) {
		form = data.form;
		schema = schemas[data.id];
		options = {
			validators: schema,
			onResult: (e) => {
				console.log(e);
			},
			onError: (e) => {
				// do something else
				console.error(e);
			}
			// ...
			// };
			// console.log(schema);
		};
	});
</script>

{#if form && schema && options}
	<FormComponent class="p-2" {schema} {form} let:config {options} debug>
		{@const formStore = config.form.form}
		<Dropfile
			on:parsed={({ detail }) => {
				const keys = Object.keys(detail.parsed);
				console.log(config);
				keys.forEach((key) => {
					if (!Object.keys(get(formStore)).includes(key)) return;
					formStore.update((f) => {
						f[key] = detail.parsed[key];
						return f;
					});
				});
			}}
		/>
		<div class="flex gap-2 py-4">
			{#each data.dropdown as { id, name, key } (id)}
				{@const items = data[name]?.map((f) => ({
					value: `${f.id}`,
					label: f[key]
				}))}
				<FormCombobox val_type="number" {config} {name} {items} />
			{/each}
		</div>
		<div>
			{#each Object.keys(form.data) as name (name)}
				{#if check_key_to_include(name)}
					<Form.Field {config} {name}>
						{#if typeof form.data[name] === 'boolean'}
							<Form.Item
								class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
							>
								<div class="space-y-1 leading-none">
									<Form.Label>{name}</Form.Label>
								</div>
								<Form.Checkbox />
								<Form.Validation />
							</Form.Item>
						{:else}
							<Form.Item>
								<Form.Label>{name}</Form.Label>
								<Form.Input type={typeof form.data[name]} />
								<Form.Validation />
							</Form.Item>
						{/if}
					</Form.Field>
				{/if}
			{/each}
		</div>
		<div class="flex gap-2 flex-col">
			{#each data.fileInput as { id, name, required } (id)}
				<!-- <Form.Field {config} {name}>
					<Form.Item> -->
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Label for={name}>{name}</Label>
					<Input id={name} type="file" {required} />
				</div>
				<!-- <Form.Validation /> -->
				<!-- </Form.Item>
				</Form.Field> -->
			{/each}
		</div>
	</FormComponent>
{/if}
