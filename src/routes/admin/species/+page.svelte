<script lang="ts">
	import type { PageData } from './$types';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import speciesSchema from '$lib/schemas/species';
	import AutoFillInchi from './auto-fill-inchi.svelte';
	import AutoFillName from '../auto-fill-name.svelte';
	import NameHtml from './name-html.svelte';
	import FormField from '$lib/components/forms/form-field.svelte';

	export let data: PageData;
</script>

<FormComponent
	footer={false}
	schema={speciesSchema}
	form={data.form}
	let:config
	let:formStore
	let:submitting
	debug={import.meta.env.DEV}
>
	<Card.Root>
		<Card.Header>
			<Card.Title>Upload new species</Card.Title>
			<Card.Description>Add new species to the database. Approval not required.</Card.Description>
		</Card.Header>
		<Card.Content>
			<AutoFillName
				callback={(db, data) => {
					// console.log({ db, data });
					if (db === 'cdms') {
						const { name } = data;
						formStore.update((f) => {
							f.name = name.default;
							f.iupac_name = '';
							f.name_formula = name.formula.default;
							f.name_html = name.html.default;
							return f;
						});
					} else if (db === 'jpl') {
						formStore.update((f) => {
							f.name = data.name_meta.join(', ');
							f.name_formula = data.Name;
							return f;
						});
					}
				}}
			/>

			<FormField {config} name="name" description="Enter comma separated name(s)" />
			<FormField
				{config}
				name="iupac_name"
				description="Unique IUPAC name. Tips: enter conformer type, vibrational states within parenthesis"
			/>
			<FormField {config} name="name_formula" />

			<Form.Field {config} name="name_html">
				<Form.Item>
					<Form.Label>name_html</Form.Label>
					<div class="grid grid-cols-4 gap-4 items-center">
						<Form.Input required class="col-span-3" />
						<NameHtml />
					</div>
					<Form.Validation />
					<Form.Description>
						Enter symbols in sup or sub tags i.e., {'<sup>+</sup>'} for superscript H<sup>+</sup>and {'<sub>2</sub>'}
						for subscripts H<sub>2</sub>O, and {'<i>c</i>-C<sub>3</sub>H<sup>+</sup>'} for {@html '<i>c</i>-C<sub>3</sub>H<sup>+</sup>'}
					</Form.Description>
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="smiles">
				<Form.Item>
					<Form.Label>smiles</Form.Label>
					<AutoFillInchi />
					<Form.Validation />
					<Form.Description>Tips: Try to fetch from PubChem or enter manually</Form.Description>
				</Form.Item>
			</Form.Field>

			<FormField {config} name="standard_inchi" label="InChI" />
			<FormField {config} name="standard_inchi_key" label="InChI Key" />
			<FormField {config} textarea name="notes">
				<svelte:fragment slot="name">
					<br />
					<div class="flex flex-col gap-1 text-info">
						<span>
							<span class="font-bold">NOTE:</span> Only general notes related to species should be entered
							here like it's electronic state, detected in space, etc.,.
						</span>
						<span>
							Please enter the notes to <span class="font-bold">species-metadata</span> (next step in
							metadata page) if it is obtained/relevant to the specific database such as CDMS or JPL.
						</span>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="description">
					<span>Enter any notes. Tips: enter electronic state.</span>
					<!-- <span class="text-blue">
						NOTE: Please enter the notes to species-metadata if it is obtained/relevant to the
						specific database notes such as CDMS or JPL. Only general notes related to species
						should be entered here.
					</span> -->
				</svelte:fragment>
			</FormField>
		</Card.Content>
		<Card.Footer class="flex gap-4 justify-center">
			<Form.Button class="w-[150px] flex gap-4" disabled={submitting}>
				<span>Submit</span>
				{#if submitting}
					<span class="loading loading-spinner"></span>
				{/if}
			</Form.Button>
		</Card.Footer>
	</Card.Root>
</FormComponent>
