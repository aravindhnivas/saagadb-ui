<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';

	export let form: SuperValidated<(typeof Schemas)['species-metadata']>;

	const value = 'species-metadata';
	const schema = Schemas[value];

	const species = getContext('species') as Species[];
	const linelist = getContext('linelist') as Linelist[];
</script>

<FormTabContents {value} enctype="multipart/form-data" {schema} {form} let:config>
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

	<Form.Field {config} name="degree_of_freedom">
		<Form.Item>
			<Form.Label>degree_of_freedom</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="molecule_tag">
		<Form.Item>
			<Form.Label>molecule_tag</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="category">
		<Form.Item>
			<Form.Label>category</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="mu_a">
		<Form.Item>
			<Form.Label>mu_a</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="mu_b">
		<Form.Item>
			<Form.Label>mu_b</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="mu_c">
		<Form.Item>
			<Form.Label>mu_c</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="a_const">
		<Form.Item>
			<Form.Label>a_const</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="b_const">
		<Form.Item>
			<Form.Label>b_const</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="c_const">
		<Form.Item>
			<Form.Label>c_const</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="data_date">
		<Form.Item>
			<Form.Label>data_date</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="data_contributor">
		<Form.Item>
			<Form.Label>data_contributor</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

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
		{#each ['int_file', 'var_file', 'fit_file'] as item}
			<Form.Field {config} name="qpart_file">
				<Form.Item>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Form.Label>qpart_file</Form.Label>
						<Form.Input type="file" />
					</div>
					<Form.Validation />
				</Form.Item>
			</Form.Field>
		{/each}
	</div>
</FormTabContents>
