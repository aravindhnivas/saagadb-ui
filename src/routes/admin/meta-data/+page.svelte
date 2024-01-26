<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import Dropfile from '$lib/components/file-drop.svelte';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Schemas, dropdowns, fileInputs, metadata_items } from '$lib/schemas/metadata';
	import * as Form from '$lib/components/ui/form';
	import FormCombobox from '$lib/components/combobox/form-combobox.svelte';
	import type { PageData } from './$types';
	import MessageAlert from '$lib/components/forms/message-alert.svelte';
	import type { FormOptions } from 'formsnap';
	import Combobox from '$lib/components/combobox/combobox.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { get } from 'svelte/store';
	import { oO } from '@zmotivat0r/o0';
	import Error from '../../+error.svelte';
	import { message } from 'sveltekit-superforms/client';

	export let data: PageData;

	const check_key_to_include = (metaid: string, key: string) => {
		const arr_file_input = fileInputs[metaid].map((f) => f.name);
		const arr_dropdown = dropdowns[metaid].map((f) => f.name);
		const arr = new Set([...arr_file_input, ...arr_dropdown]);
		return !arr.has(key);
	};

	let error_message = '';
	const options: FormOptions<(typeof Schemas)[number]> = {
		resetForm: false,
		// applyAction: false,
		invalidateAll: false,
		taintedMessage: null,
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				error_message = 'Please check the form above for errors';
			} else {
				error_message = '';
			}
		},
		onError: (e) => {
			// do something else
			console.error(e);
		}
	};

	let species_id = 0;
	let linelist_id = 0;
	let ref_doi = '';
	// $: console.log({ species_id, linelist_id, ref_doi });

	async function fetch_meta_id(): Promise<string | number | undefined> {
		if (!(species_id && linelist_id)) throw toast.error('Please enter a species and linelist');
		const res = await fetch(
			`/api/data/species-metadata/query/?species_id=${species_id}&linelist_id=${linelist_id}`
		);
		const data = (await res.json()) as Species[];
		console.log(data);

		if (data.length === 0) {
			toast.error('No metadata found for this species and linelist');
			return;
		}
		return data[0].id;
	}

	async function fetch_ref_id(): Promise<string | number | undefined> {
		if (!ref_doi) throw toast.error('Please enter a doi');
		const res = await fetch(`/api/data/reference?doi=${ref_doi}`);
		const data = (await res.json()) as Reference[];
		console.log(data);
		if (data.length === 0) {
			toast.error('No reference found for this doi');
			return;
		}
		return data[0].id;
	}
</script>

{#each metadata_items as { value: metaid } (metaid)}
	{@const schema = Schemas[metaid]}
	{@const form = data.forms[metaid]}

	<FormTabContents
		value={metaid}
		class="py-2"
		enctype="multipart/form-data"
		{schema}
		{form}
		let:config
		{options}
		debug={import.meta.env.DEV}
		let:formStore
	>
		<MessageAlert />
		<svelte:fragment slot="description">
			<Dropfile />
		</svelte:fragment>

		{#if metaid === 'meta-reference' || metaid === 'line'}
			<div class="grid gap-2 border-gray border-2 p-2 rounded-4">
				<div class="flex gap-2 items-end">
					<Combobox
						label="species"
						items={data.species.map((f) => ({
							value: `${f.id}`,
							label: f.name_formula
						}))}
						on:change={(e) => {
							species_id = e.detail.value;
						}}
					/>
					<Combobox
						label="linelist"
						items={data.linelist.map((f) => ({
							value: `${f.id}`,
							label: f.linelist_name
						}))}
						on:change={(e) => {
							linelist_id = e.detail.value;
						}}
					/>
					<Button
						variant="outline"
						on:click={async () => {
							const [err, id] = await oO(fetch_meta_id());
							if (err instanceof Error) return toast.error(err.message);
							formStore.update((f) => {
								f.meta = id;
								return f;
							});
						}}>Fetch meta_id</Button
					>
				</div>
				{#if metaid === 'meta-reference'}
					<div class="flex gap-2">
						<Input bind:value={ref_doi} placeholder="Enter reference doi" />
						<Button
							variant="outline"
							on:click={async () => {
								const [err, id] = await oO(fetch_ref_id());
								if (err instanceof Error) return toast.error(err.message);
								formStore.update((f) => {
									f.ref = id;
									return f;
								});
							}}>Fetch ref_id</Button
						>
					</div>
				{/if}
			</div>
		{/if}

		<div class="grid-auto-fill lg:max-w-md sm:max-w-full">
			{#each dropdowns[metaid] as { id, name, key } (id)}
				{@const items = data[name]?.map((f) => ({
					value: `${f.id}`,
					label: f[key]
				}))}
				<FormCombobox val_type="number" {config} {name} {items} />
			{/each}
		</div>

		{#each Object.keys(form.data) as name (name)}
			{#if check_key_to_include(metaid, name)}
				<Form.Field {config} {name}>
					{#if typeof form.data[name] === 'boolean'}
						<Form.Item class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
							<div class="space-y-1 leading-none">
								<Form.Label>{name}</Form.Label>
							</div>
							<Form.Checkbox />
							<Form.Validation />
						</Form.Item>
					{:else}
						<Form.Item>
							<Form.Label>{name}</Form.Label>
							<Form.Input type={typeof form.data[name]} />
							<Form.Validation />
						</Form.Item>
					{/if}
				</Form.Field>
			{/if}
		{/each}

		<div class="grid-auto-fill">
			{#each fileInputs[metaid] as { id, name, required } (id)}
				<Form.Field {config} {name}>
					<Form.Item>
						<div class="grid w-full max-w-sm items-center gap-1.5">
							<Form.Label>{name}</Form.Label>
							<Form.Input type="file" {required} />
						</div>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
			{/each}
		</div>

		<!-- <Form.Button class="m-2">Submit</Form.Button> -->

		{#if error_message}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description>{error_message}</Alert.Description>
			</Alert.Root>
		{/if}
	</FormTabContents>
	<!-- </TabContents> -->
{/each}
