<script lang="ts">
	// import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import { getContext } from 'svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import SuperDebug, { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	// import AutoFillMetadata from './auto-fill-metadata.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { HelpCircle } from 'lucide-svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';
	import FormField from '$lib/components/forms/form-field.svelte';
	import * as Select from '$lib/components/ui/select';

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
	] as const;
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
					<FormField form={superform} name="species">
						<FormCombobox
							items={species.map((f) => ({
								value: `${f.id}`,
								label: f.name_formula
							}))}
							label="Species"
							bind:value={$formStore['species']}
						/>
					</FormField>

					<FormField form={superform} name="linelist">
						<FormCombobox
							items={linelist.map((f) => ({
								value: `${f.id}`,
								label: f.linelist_name
							}))}
							label="linelist"
							bind:value={$formStore['linelist']}
						/>
					</FormField>

					<FormField form={superform} name="category">
						<FormCombobox
							items={category.map((f) => ({
								value: f,
								label: f
							}))}
							label="category"
							bind:value={$formStore['category']}
							on:change={(e) => {
								const degree_of_freedom = e.detail === 'diatomic' || e.detail === 'linear' ? 2 : 3;
								formStore.update((f) => {
									f.degree_of_freedom = degree_of_freedom;
									return f;
								});
							}}
						/>
					</FormField>
				</div>
				<div class="grid-auto-fill">
					<FormField
						form={superform}
						name="hyperfine"
						checkbox={true}
						bind:value={$formStore['hyperfine']}
					/>
					{#each keys as { name }}
						<FormField form={superform} {name} bind:value={$formStore[name]} />
					{/each}
				</div>
				<FormField form={superform} name="notes" bind:value={$formStore['notes']} textarea={true} />

				<div class="flex gap-4 w-full max-w-4xl items-baseline">
					<div class="basis-3/4">
						<FormField form={superform} name="qpart_file">
							<Form.Label>
								<div class="flex gap-4 items-center">
									<span>qpart_file</span>
									<span aria-label="Quantum partition function" data-cooltipz-dir="down">
										<HelpCircle />
									</span>
								</div>
							</Form.Label>
							<Textarea required bind:value={$formStore['qpart_file']} />
						</FormField>
					</div>
					<div class="basis-1/4">
						<Label>OR choose qpart file</Label>
						<Input
							type="file"
							required={false}
							on:change={(e) => {
								const target = e.target;
								const file = target?.files?.[0];
								// console.log(file);
								if (!file) return console.error('No file selected');
								// console.log('Reading file');
								const reader = new FileReader();
								// console.log('File reader created', reader);
								reader.onload = async (e) => {
									// console.log('File read');
									const text = e.target?.result;
									console.log(text);
									$formStore['qpart_file'] = text;
									// formStore.update((f) => {
									// 	f.qpart_file = text;
									// 	return f;
									// });
								};
								reader.readAsText(file);
							}}
						/>
					</div>
				</div>

				<div class="grid-auto-fill">
					{#each files_keys as { name, description }}
						<div class="grid w-full max-w-sm items-center gap-1.5">
							<Label for={name}>{name}</Label>
							<Input id={name} type="file" {name} />
						</div>
						<!-- <FormField form={superform} {name} {description} let:constraints let:attrs>
							<div class="grid w-full max-w-sm items-center gap-1.5">
								<Form.Label>
									<div class="flex gap-4 items-center">
										<span>{name}</span>
										<span aria-label={description} data-cooltipz-dir="down">
											<HelpCircle />
										</span>
									</div>
								</Form.Label>
								<Input type="file" {...attrs} {...constraints} {name} />
							</div>
						</FormField> -->
					{/each}
				</div>
			</Card.Content>

			<Card.Footer class="justify-center">
				<Form.Button class="w-[150px] flex gap-4" disabled={$submitting}>
					<span>Upload</span>
					{#if $submitting}
						<span class="loading loading-spinner"></span>
					{/if}
				</Form.Button>
			</Card.Footer>
		</form>
	</Card.Root>
</Tabs.Content>

{#if import.meta.env.DEV}
	<SuperDebug data={$formStore} />
{/if}
