<script lang="ts">
	import TabContents from '$lib/components/tab-contents.svelte';
	import Dropfile from '$lib/components/dropfile.svelte';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import { schemas, ids, dropdowns, fileInputs } from '$lib/utils/schemas/meta';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import type { FormOptions, SuperValidated } from 'formsnap';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { metadata_items } from '$lib/utils/metadata';
	import type { PageData } from './$types';

	export let data: PageData;
	const values = metadata_items.map((m) => m.value);
	console.log({ metadata_items, values, data });

	const check_key_to_include = (metaid: string, key: string) => {
		const arr_file_input = fileInputs[metaid].map((f) => f.name);
		const arr_dropdown = dropdowns[metaid].map((f) => f.name);
		const arr = new Set([...arr_file_input, ...arr_dropdown]);
		return !arr.has(key);
	};
</script>

{#each metadata_items as { value: metaid, name: title } (metaid)}
	<TabContents value={metaid} {title} description="Description">
		{@const schema = schemas[metaid]}
		{@const form = data.forms[metaid]}
		<FormComponent footer={false} class="p-2" {schema} {form} let:config debug>
			<div class="flex gap-2 py-4">
				{#each dropdowns[metaid] as { id, name, key } (id)}
					{@const items = data[name]?.map((f) => ({
						value: `${f.id}`,
						label: f[key]
					}))}
					<FormCombobox val_type="number" {config} {name} {items} />
				{/each}
			</div>
			<div>
				{#each Object.keys(form.data) as name (name)}
					{#if check_key_to_include(metaid, name)}
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
				{#each fileInputs[metaid] as { id, name, required } (id)}
					<Form.Field {config} {name}>
						<Form.Item>
							<div class="grid w-full max-w-sm items-center gap-1.5">
								<Label for={name}>{name}</Label>
								<Input id={name} type="file" {required} />
							</div>
							<Form.Validation />
						</Form.Item>
					</Form.Field>
				{/each}
			</div>
		</FormComponent>
	</TabContents>
{/each}
