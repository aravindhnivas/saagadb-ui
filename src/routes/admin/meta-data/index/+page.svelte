<script lang="ts">
	import TabContents from '$lib/components/tab-contents.svelte';
	import Dropfile from '$lib/components/dropfile.svelte';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import { schemas, dropdowns, fileInputs } from '$lib/utils/schemas/meta';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import { metadata_items } from '$lib/utils/metadata';

	import type { PageData } from './$types';
	import MessageAlert from '$lib/components/forms/message-alert.svelte';
	import type { FormOptions } from 'formsnap';

	export let data: PageData;

	const check_key_to_include = (metaid: string, key: string) => {
		const arr_file_input = fileInputs[metaid].map((f) => f.name);
		const arr_dropdown = dropdowns[metaid].map((f) => f.name);
		const arr = new Set([...arr_file_input, ...arr_dropdown]);
		return !arr.has(key);
	};

	let error_message = '';
	const options: FormOptions<(typeof schemas)[number]> = {
		resetForm: true,
		// applyAction: false,
		invalidateAll: false,
		taintedMessage: null,
		onResult: (e) => {
			console.log(e);
			if (e.result.type === 'failure') {
				error_message = 'Please check the form above for errors';
			} else {
				error_message = '';
			}
		},
		onError: (e) => {
			// do something else
			console.error(e);
		}
	};
</script>

{#each metadata_items as { value: metaid, name: title } (metaid)}
	<TabContents footer={false} value={metaid} {title} description="Description">
		{@const schema = schemas[metaid]}
		{@const form = data.forms[metaid]}

		<Form.Root enctype="multipart/form-data" {schema} {form} let:config {options} debug>
			<MessageAlert />

			{#each dropdowns[metaid] as { id, name, key } (id)}
				{@const items = data[name]?.map((f) => ({
					value: `${f.id}`,
					label: f[key]
				}))}
				<FormCombobox val_type="number" {config} {name} {items} />
			{/each}

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

			{#each fileInputs[metaid] as { id, name, required } (id)}
				<Form.Field {config} {name}>
					<Form.Item>
						<div class="grid w-full max-w-sm items-center gap-1.5">
							<Form.Label>{name}</Form.Label>
							<Form.Input type="file" {required} />
						</div>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/each}

			<Form.Button class="m-2">Submit</Form.Button>
			{error_message}
		</Form.Root>
	</TabContents>
{/each}
