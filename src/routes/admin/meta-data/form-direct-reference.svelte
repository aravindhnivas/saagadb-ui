<script lang="ts">
	import { active_obj, active_ind, doi_collections } from './stores';
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { toast } from 'svelte-sonner';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import AlertBox from '$lib/components/utils/alert-box.svelte';
	import { oO } from '@zmotivat0r/o0';
	import FormField from '$lib/components/forms/form-field.svelte';
	import Loader from '$lib/components/utils/loader.svelte';
	import AutoFetchRef from './auto-fetch-ref.svelte';
	import FetchMetaId from './fetch-meta-id.svelte';

	export let form: SuperValidated<(typeof Schemas)['direct-reference']>;

	const value = 'direct-reference';
	const schema = Schemas[value];
	let fetching = false;
</script>

<FormTabContents
	{value}
	enctype="multipart/form-data"
	{schema}
	{form}
	let:config
	let:formStore
	let:formValues
	let:submitting
	footer={false}
	resetForm={false}
	show_message_alert={false}
	title="Direct Reference"
	description="Add references to the species-metadata"
>
	<AlertBox
		message="[Only for CDMS] You can skip the next two steps (Reference and Meta reference) if you complete this without error."
		variant="default"
		title="NOTE"
	/>
	<AutoFetchRef {submitting}>
		<svelte:fragment slot="header">
			<div class="flex items-end gap-4">
				<FetchMetaId />
				<FormField {config} name="meta" />
			</div>
		</svelte:fragment>

		{#if $active_obj?.type !== 'success' && !$active_obj?.status?.includes('This entry already exists in the database')}
			<FormField
				{config}
				name="doi"
				on:change={() => {
					$doi_collections[$active_ind]['doi'] = formValues.doi;
				}}
			/>
			<Button
				id="auto_fill_doi_button"
				variant="outline"
				class="w-[150px]"
				on:click={async () => {
					try {
						fetching = true;
						formStore.update((f) => {
							f.doi = f.doi.trim();
							return f;
						});

						if (formValues.doi.includes('doi.org')) {
							const corr_doi = formValues.doi.split('doi.org/')[1];
							formStore.update((f) => {
								f.doi = corr_doi;
								return f;
							});
						}
						const doi = formValues.doi;
						if (!doi) throw new Error('DOI is required');
						const { href, bibtex_text, parsed } = await fetch_bibfile({ doi });
						// if($doi_collections[$active_ind]) return;
						$doi_collections[$active_ind]['cite'] = parsed;
						formStore.update((f) => {
							f.ref_url = href.replace('http://dx.doi.org/', 'https://doi.org/');
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

			<Loader {fetching} />
			<FormField
				{config}
				name="ref_url"
				on:change={() => {
					$doi_collections[$active_ind]['ref_url'] = formValues.ref_url;
				}}
			/>

			{#if formValues.ref_url}
				<a href={formValues.ref_url} target="_blank" rel="noopener noreferrer" class="underline">
					Check reference link
				</a>
			{/if}

			<div class="flex gap-4 w-full items-baseline">
				<Form.Field {config} name="bibtex" let:constraints let:attrs>
					<Form.Item class="basis-3/4">
						<Form.Label>bibtex</Form.Label>
						<Form.Textarea
							{...constraints}
							{...attrs.input}
							on:change={() => {
								$doi_collections[$active_ind]['bibtex'] = formValues.bibtex;
							}}
						/>
						<Form.Validation {...attrs.validation} />
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

			{#if $active_obj?.cite}
				<div class="grid gap-2">
					<AlertBox message={$active_obj?.cite} variant="default" title="Fetched citation" />
					<button
						class="btn btn-sm w-[150px]"
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
							$doi_collections[$active_ind]['cite'] = data.parsed;
							toast.success('Bibtex parsed successfully');
						}}
						>Parse bibtex
					</button>
					<div class="alert text-sm p-1">
						Check the fetched citation and if needded make changes to the bibtex and then click on
						the "Parse bibtex" button.
					</div>
				</div>
			{/if}

			<FormField
				{config}
				name="notes"
				textarea
				on:change={(e) => {
					// console.log('formValues.notes', formValues.notes);
					if ($active_ind < 0) return;
					$doi_collections[$active_ind]['notes'] = e.detail.value;
				}}
			/>

			<FormField
				{config}
				name="dipole_moment"
				checkbox
				on:change={(e) => {
					$doi_collections[$active_ind]['dipole_moment'] = e.detail.value;
				}}
			/>
			<FormField
				{config}
				name="spectrum"
				checkbox
				on:change={(e) => {
					$doi_collections[$active_ind]['spectrum'] = e.detail.value;
				}}
			/>
		{/if}
	</AutoFetchRef>
</FormTabContents>
