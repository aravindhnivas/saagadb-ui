<script lang="ts">
	// import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import { getContext } from 'svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	// import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	// import AutoFillMetadata from './auto-fill-metadata.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { HelpCircle } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';

	// export let form: SuperValidated<(typeof Schemas)['species-metadata']>;
	const value = 'species-metadata' as const;
	const schema = Schemas[value];

	export let form: SuperValidated<typeof schema & Record<string, unknown>>;

	const species = getContext('species') as Species[];
	const linelist = getContext('linelist') as Linelist[];

	const category = [
		'diatomic',
		'linear',
		'asymmetric top',
		'spherical top',
		'symmetric top',
		'prolate symmetric top',
		'oblate symmetric top'
	];

	const keys = [
		{ name: 'degree_of_freedom', type: 'number', required: true },
		{ name: 'molecule_tag', type: 'number', required: true },
		{ name: 'mu_a', type: 'string', required: false },
		{ name: 'mu_b', type: 'string', required: false },
		{ name: 'mu_c', type: 'string', required: false },
		{ name: 'a_const', type: 'string', required: false },
		{ name: 'b_const', type: 'string', required: false },
		{ name: 'c_const', type: 'string', required: false },
		{ name: 'data_date', type: 'string', required: true },
		{ name: 'data_contributor', type: 'string', required: true }
	];
	const files_keys = [
		{
			name: 'int_file',
			description: 'mu_a, mu_b, and mu_c dipoles will be extracted from this file'
		},
		{
			name: 'var_file',
			description: 'A, B, and C rotational constants will be extracted from this file'
		},
		{ name: 'fit_file', description: '.fit file of the species' },
		{ name: 'lin_file', description: 'Line list file' }
	];
	let error_message = '';
	const superform = superForm(form, {
		validators: zodClient(schema),
		resetForm: false,
		// applyAction: false,
		invalidateAll: false,
		taintedMessage: null,
		onSubmit: () => {
			error_message = '';
		},
		onResult: ({ result }) => {
			console.log(result);
			if (result.type === 'failure') {
				error_message = 'Please check the form above for errors';
			} else {
				error_message = '';
			}
		},
		onError: (e) => {
			console.error(e);
		}
	});
	const { form: formStore, enhance, submitting, posted, errors } = superform;
</script>

<Tabs.Content {value}>
	<Card.Root>
		<form use:enhance method="POST" enctype="multipart/form-data">
			<Card.Header>
				<Card.Title>Species Metadata</Card.Title>
				<Card.Description>Add new species metadata</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2 ">
				<!-- <MessageAlert /> -->
				<!-- <AutoFillMetadata /> -->

				<div class="grid-auto-fill">
					<!-- <FormCombobox
			val_type="number"
			{config}
			name={'species'}
			items={species.map((f) => ({
				value: `${f.id}`,
				label: f.name_formula
			}))}
		/> -->

					<!-- <FormCombobox
			val_type="number"
			{config}
			name={'linelist'}
			items={linelist.map((f) => ({
				value: `${f.id}`,
				label: f.linelist_name
			}))}
		/> -->

					<!-- <FormCombobox
			{config}
			name={'category'}
			items={category.map((f) => ({
				value: f,
				label: f
			}))}
			on:change={(e) => {
				const degree_of_freedom = e.detail === 'diatomic' || e.detail === 'linear' ? 2 : 3;
				formStore.update((f) => {
					f.degree_of_freedom = degree_of_freedom;
					return f;
				});
			}}
		/> -->
					<Form.Field form={superform} name="hyperfine" let:constraints>
						<Form.Control let:attrs>
							<div class="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
								<div class="space-y-1 leading-none">
									<Form.Label>hyperfine</Form.Label>
								</div>
								<Checkbox {...attrs} {...constraints} bind:checked={$formStore.hyperfine} />
							</div>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
				<div class="grid-auto-fill">
					{#each keys as { name, type, required }}
						<Form.Field form={superform} {name} let:constraints>
							<Form.Control let:attrs>
								<Form.Label>{name}</Form.Label>
								<Input {...attrs} {...constraints} bind:value={$formStore[name]} />
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					{/each}
				</div>
				<Form.Field form={superform} name="notes" let:constraints>
					<Form.Control let:attrs>
						<Form.Label>notes</Form.Label>
						<Textarea {...attrs} {...constraints} bind:value={$formStore.notes} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<!-- <Form.Field {config} name="notes">
		<Form.Item>
			<Form.Label>notes</Form.Label>
			<Form.Textarea />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<div class="flex gap-4 w-full items-baseline">
		<Form.Field {config} name="qpart_file">
			<Form.Item class="basis-3/4">
				<Form.Label>
					<div class="flex gap-4 items-center">
						<span>qpart_file</span>
						<span aria-label="Quantum partition function" data-cooltipz-dir="down">
							<HelpCircle />
						</span>
					</div>
				</Form.Label>
				<Form.Textarea required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label>OR choose qpart file</Label>
			<Input
				type="file"
				required={false}
				on:change={(e) => {
					const target = e.target;
					const file = target?.files?.[0];
					if (!file) return;
					const reader = new FileReader();
					reader.onload = async (e) => {
						const text = e.target?.result;
						formStore.update((f) => {
							f.qpart_file = text;
							return f;
						});
					};
					reader.readAsText(file);
				}}
			/>
		</div>
	</div>

	<div class="grid-auto-fill">
		{#each files_keys as { name, description }}
			<Form.Field {config} {name}>
				<Form.Item>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Form.Label>
							<div class="flex gap-4 items-center">
								<span>{name}</span>
								<span aria-label={description} data-cooltipz-dir="down">
									<HelpCircle />
								</span>
							</div>
						</Form.Label>
						<Form.Input type="file" required={false} />
					</div>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}
	</div> -->
			</Card.Content>

			<!-- {#if footer} -->
			<Card.Footer class="justify-center">
				<Form.Button class="w-[150px] flex gap-4" disabled={$submitting}>
					<span>Upload</span>
					{#if $submitting}
						<span class="loading loading-spinner"></span>
					{/if}
				</Form.Button>
				<!-- <slot name="footer">
						<div class="flex gap-4 items-center">
							<Form.Button
								class="w-[150px]"
								disabled={$submitting}
								variant={error_message ? 'destructive' : 'default'}
							>
								{error_message ? 'Retry upload' : 'Upload'}
							</Form.Button>
							<Loader fetching={$submitting} description="uploading the data please wait..." />
						</div>
					</slot> -->
			</Card.Footer>
			<!-- {/if} -->
		</form>
	</Card.Root>
</Tabs.Content>

{#if import.meta.env.DEV}
	<SuperDebug data={$formStore} />
{/if}

<!-- <FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:formStore
	let:form={superform}
	title="Species Metadata"
	description="Add new species metadata"
>
	
</FormTabContents> -->
