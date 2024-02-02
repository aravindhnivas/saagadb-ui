<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import AutoFillMetadata from './auto-fill-metadata.svelte';

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
	<div class="grid-auto-fill lg:max-w-md sm:max-w-full">
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
	</div>

	<FormCombobox
		val_type="number"
		{config}
		name={'category'}
		items={category.map((f) => ({
			value: f,
			label: f
		}))}
	/>

	{#each keys as name}
		<Form.Field {config} {name}>
			<Form.Item>
				<Form.Label>{name}</Form.Label>
				<Form.Input />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/each}

	<Form.Field {config} name="notes">
		<Form.Item>
			<Form.Label>notes</Form.Label>
			<Form.Textarea />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<div class="grid-auto-fill">
		<Form.Field {config} name="qpart_file">
			<Form.Item>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Form.Label>qpart_file</Form.Label>
					<Form.Input type="file" required />
				</div>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		{#each ['int_file', 'var_file', 'fit_file'] as name}
			<Form.Field {config} {name}>
				<Form.Item>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Form.Label>{name}</Form.Label>
						<Form.Input type="file" />
					</div>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}
	</div>
</FormTabContents>
