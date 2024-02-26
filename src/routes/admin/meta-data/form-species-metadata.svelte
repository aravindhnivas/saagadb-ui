<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import { getContext } from 'svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import AutoFillMetadata from './auto-fill-metadata.svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { HelpCircle } from 'lucide-svelte/icons';
	import Svelecte from 'svelecte';
	export let form: SuperValidated<(typeof Schemas)['species-metadata']>;

	const value = 'species-metadata';
	const schema = Schemas[value];
	const species = getContext('species') as Species[];
	const linelist = getContext('linelist') as Linelist[];

	const category = [
		'atom',
		'diatomic',
		'linear',
		'asymmetric top',
		'spherical top',
		'symmetric top',
		'prolate symmetric top',
		'oblate symmetric top'
	];

	const keys = [
		{
			name: 'degree_of_freedom',
			label: 'Degree of freedom',
			description:
				'Degree of freedom in rotational partition function (0 for atoms, 2 for linear & 3 for nonlinear molecules)'
		},
		{ name: 'molecule_tag', label: 'Molecule tag', description: 'Molecule tag id from database' },
		{ name: 'mu_a', label: 'μ<sub>a</sub> / D', description: 'Dipole moment along a-axis' },
		{ name: 'mu_b', label: 'μ<sub>b</sub> / D', description: 'Dipole moment along b-axis' },
		{ name: 'mu_c', label: 'μ<sub>c</sub> / D', description: 'Dipole moment along c-axis' },
		{ name: 'a_const', label: 'A / MHz', description: 'Rotational constant along a-axis' },
		{ name: 'b_const', label: 'B / MHz', description: 'Rotational constant along b-axis' },
		{ name: 'c_const', label: 'C / MHz', description: 'Rotational constant along c-axis' },
		{ name: 'data_date', label: 'Date of entry', description: 'YYYY-MM-DD' },
		{ name: 'data_contributor', label: 'Data contributor' }
	];

	const files_keys = [
		{
			name: 'int_file',
			description: '(Optional) If provided - dipoles moments will be extracted and overwritten'
		},
		{
			name: 'var_file',
			description: '(Optional) If provided - rotational constants will be extracted and overwritten'
		},
		{ name: 'fit_file', description: '(Optional) .fit file of the species' },
		{ name: 'lin_file', description: '(Optional) .lin file of the species' }
	];
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	let:formStore
	title="Species Metadata"
	description="Add new species metadata. Species, linelist, hyperfine makes a unique set. Use these to fetch the meta_id in meta-reference and line forms"
>
	<AutoFillMetadata />

	<div class="grid-auto-fill">
		<Form.Field {config} name="species" let:setValue let:value>
			<Form.Item class="flex flex-col">
				<Form.Label>species</Form.Label>
				<Svelecte
					virtualList={true}
					placeholder="Search species..."
					options={species.map((f) => ({
						id: f.id,
						label: f.name_formula
					}))}
					on:change={(e) => setValue(e.detail?.id)}
					{value}
				/>
				<Form.Validation />
				{#if value}
					<Form.Description>species_id: {value}</Form.Description>
				{/if}
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="linelist" let:setValue let:value>
			<Form.Item class="flex flex-col">
				<Form.Label>linelist</Form.Label>
				<Svelecte
					searchable={false}
					virtualList={false}
					options={linelist.map((f) => ({
						id: f.id,
						label: f.linelist_name
					}))}
					on:change={(e) => setValue(e.detail?.id)}
					{value}
				/>
				<Form.Validation />
				{#if value}
					<Form.Description>linelist_id: {value}</Form.Description>
				{/if}
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="category" let:setValue>
			<Form.Item class="flex flex-col">
				<Form.Label>category</Form.Label>
				<Svelecte
					searchable={false}
					virtualList={false}
					options={category}
					on:change={(e) => {
						const value = e.detail?.value;
						setValue(value);
						let degree_of_freedom = 3;
						if (value === 'atom') degree_of_freedom = 0;
						if (value === 'diatomic' || value === 'linear') degree_of_freedom = 2;
						formStore.update((f) => {
							f.degree_of_freedom = degree_of_freedom;
							return f;
						});
					}}
				/>
				<Form.Validation />
				<Form.Description>Rigid rotor category</Form.Description>
			</Form.Item>
		</Form.Field>

		<Form.Field {config} name="hyperfine" let:constraints let:attrs let:value>
			<Form.Item>
				<Form.Label>hyperfine</Form.Label>
				<div class="w-full">
					<Form.Checkbox checked="indeterminate" {...constraints} {...attrs} />
					<span>{value}</span>
				</div>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	</div>

	<div class="grid-auto-fill">
		{#each keys as { name, label, description }}
			<Form.Field {config} {name} let:constraints let:attrs>
				<Form.Item>
					<Form.Label>{@html label}</Form.Label>
					<Form.Input {...constraints} {...attrs} />
					<Form.Validation />
					{#if description}
						<Form.Description>{description}</Form.Description>
					{/if}
				</Form.Item>
			</Form.Field>
		{/each}
	</div>

	<Form.Field {config} name="notes" let:constraints let:attrs>
		<Form.Item>
			<Form.Label>notes</Form.Label>
			<Form.Textarea {...constraints} {...attrs} />
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
						<Form.Label>{name}</Form.Label>
						<Form.Input type="file" required={false} />
					</div>
					<Form.Validation />
					{#if description}
						<Form.Description>{description}</Form.Description>
					{/if}
				</Form.Item>
			</Form.Field>
		{/each}
	</div>
</FormTabContents>
