<script lang="ts">
	import type { PageData } from './$types';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import Dropfile from '$lib/components/file-drop.svelte';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import speciesSchema from '$lib/schemas/species';
	import AutoFillInchi from './auto-fill-inchi.svelte';
	import AutoFillName from '../auto-fill-name.svelte';
	import NameHtml from './name-html.svelte';
	export let data: PageData;
</script>

<FormComponent
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
			<AutoFillName
				callback={(db, data) => {
					console.log({ db, data });
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
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label>name</Form.Label>
					<Form.Input required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="iupac_name">
				<Form.Item>
					<Form.Label>iupac_name</Form.Label>
					<Form.Input required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="name_formula">
				<Form.Item>
					<Form.Label>name_formula</Form.Label>
					<Form.Input required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="name_html">
				<Form.Item>
					<Form.Label>name_html</Form.Label>
					<div class="grid grid-cols-4 gap-4 items-center">
						<Form.Input required class="col-span-3" />
						<NameHtml />
					</div>
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="smiles">
				<Form.Item>
					<Form.Label>smiles</Form.Label>
					<AutoFillInchi />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="standard_inchi">
				<Form.Item>
					<Form.Label>InChI</Form.Label>
					<Form.Input required />
					<Form.Validation />
				</Form.Item>
			</Form.Field>

			<Form.Field {config} name="standard_inchi_key">
				<Form.Item>
					<Form.Label>InChI Key</Form.Label>
					<Form.Input required />
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
		</Card.Content>
		<Card.Footer class="flex gap-4 justify-center">
			<Form.Button class="w-[150px]">Submit</Form.Button>
		</Card.Footer>
	</Card.Root>
</FormComponent>
