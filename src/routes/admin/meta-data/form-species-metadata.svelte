<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import AutoFillMetadata from './auto-fill-metadata.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { HelpCircle } from 'lucide-svelte';

	export let form: SuperValidated<(typeof Schemas)['species-metadata']>;

	const value = 'species-metadata';
	const schema = Schemas[value];
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
		'degree_of_freedom',
		'molecule_tag',
		'mu_a',
		'mu_b',
		'mu_c',
		'a_const',
		'b_const',
		'c_const',
		'data_date',
		'data_contributor'
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
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	let:formStore
	include_dropfile={false}
	title="Species Metadata"
	description="Add new species metadata"
>
	<AutoFillMetadata />

	<div class="grid-auto-fill">
		<FormCombobox
			val_type="number"
			{config}
			name={'species'}
			items={species.map((f) => ({
				value: `${f.id}`,
				label: f.name_formula
			}))}
		/>

		<FormCombobox
			val_type="number"
			{config}
			name={'linelist'}
			items={linelist.map((f) => ({
				value: `${f.id}`,
				label: f.linelist_name
			}))}
		/>

		<FormCombobox
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
		/>
		<Form.Field {config} name="hyperfine">
			<Form.Item class="flex flex-row items-end space-x-3 space-y-0 rounded-md border p-4">
				<div class="space-y-1 leading-none">
					<Form.Label>hyperfine</Form.Label>
				</div>
				<Form.Checkbox checked="indeterminate" />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>
	<div class="grid-auto-fill">
		{#each keys as name}
			<Form.Field {config} {name}>
				<Form.Item>
					<Form.Label>{name}</Form.Label>
					<Form.Input />
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}
	</div>

	<Form.Field {config} name="notes">
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
	</div>
</FormTabContents>
