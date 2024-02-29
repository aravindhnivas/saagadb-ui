<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { get } from 'svelte/store';
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { tick } from 'svelte';
	import { oO } from '@zmotivat0r/o0';
	export let form: SuperValidated<(typeof Schemas)['reference']>;

	const value = 'reference';
	const schema = Schemas[value];
	let fetching = false;
	let parsed_bibtex = '';
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	let:formStore
	let:formValues
	title="Reference"
	description="Please enter the details of the reference. DOI is required to auto-fill the form. If you have the bibtex file, you can upload it."
>
	<Form.Field {config} name="doi">
		<Form.Item>
			<Form.Label>doi</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Button
		class="h-8"
		variant="outline"
		on:click={async () => {
			try {
				fetching = true;
				formStore.update((f) => {
					f.doi = f.doi.trim();
					return f;
				});
				const doi = formValues.doi;
				if (!doi) throw new Error('DOI is required');
				const { href, bibtex_text, parsed } = await fetch_bibfile({ doi });
				parsed_bibtex = parsed;
				formStore.update((f) => {
					f.ref_url = href;
					f.bibtex = bibtex_text;
					return f;
				});
			} catch (error) {
				if (error instanceof Error) toast.error(error.message);
			} finally {
				fetching = false;
			}
		}}>Auto-fill from DOI</Button
	>

	{#if fetching}
		<div class="flex gap-2 items-center h-10">
			<span class="loading loading-spinner"></span>
			<span>Fetching...</span>
		</div>
	{/if}

	<Form.Field {config} name="ref_url">
		<Form.Item>
			<Form.Label>ref_url</Form.Label>
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

	<div class="flex gap-4 w-full items-baseline">
		<Form.Field {config} name="bibtex">
			<Form.Item class="basis-3/4">
				<Form.Label>bibtex</Form.Label>
				<Form.Textarea required />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label>OR choose bibtex file</Label>
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
							f.bibtex = text;
							return f;
						});
					};
					reader.readAsText(file);
				}}
			/>
		</div>
	</div>

	{#if parsed_bibtex && formValues.bibtex}
		<AlertBox message={parsed_bibtex} variant="default" title="Fetched citation" />
		<button
			class="btn btn-sm"
			on:click={async (e) => {
				e.preventDefault();
				if (!formValues.doi) return;
				if (!formValues.bibtex) return;
				const [err, data] = await oO(fetch_bibfile({ bibtex: formValues.bibtex }));
				if (err instanceof Error) {
					console.error(err.stack);
					toast.error(err.message);
					return;
				}
				if (!data?.parsed) {
					toast.error('Failed to parse bibtex');
					return;
				}
				parsed_bibtex = data.parsed;
				toast.success('Bibtex parsed successfully');
			}}
			>Parse bibtex
		</button>
		<div class="alert text-sm p-1">
			Check the fetched citation and if needded make changes to the bibtex and then click on the
			"Parse bibtex" button.
		</div>
	{/if}
</FormTabContents>
