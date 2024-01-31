<script lang="ts">
	import FormTabContents from '$lib/components/forms/form-tab-contents.svelte';
	import { Schemas } from '$lib/schemas/metadata';
	import type { SuperValidated } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import fetch_bibfile from '$lib/utils/bibfile';
	import { get } from 'svelte/store';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { toast } from 'svelte-sonner';

	export let form: SuperValidated<(typeof Schemas)['reference']>;

	const value = 'reference';
	const schema = Schemas[value];
	let auto_fill = false;
	let fetching = false;
</script>

<FormTabContents {value} enctype="multipart/form-data" {schema} {form} let:config let:formStore>
	<Form.Field {config} name="doi">
		<Form.Item>
			<Form.Label>doi</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<div class="flex gap-4 items-center">
		<span>Auto fill from doi</span>
		<Switch bind:checked={auto_fill} on:onCheckedChange={(e) => console.log(e)} />
		{#if auto_fill}
			<Button
				class="h-8"
				variant="outline"
				on:click={async () => {
					try {
						fetching = true;
						const doi = get(formStore)['doi'];
						if (!doi) throw new Error('DOI is required');
						const { href, bibtex_text } = await fetch_bibfile({ doi });
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
		{/if}
	</div>

	<Form.Field {config} name="ref_url">
		<Form.Item>
			<Form.Label>ref_url</Form.Label>
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

	{#if auto_fill}
		<Form.Field {config} name="bibtex">
			<Form.Item>
				<Form.Label>bibtex</Form.Label>
				<Form.Textarea />
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{:else}
		<Form.Field {config} name="bibtex_file">
			<Form.Item>
				<div class="grid w-full max-w-sm items-center gap-1.5">
					<Form.Label>bibtex</Form.Label>
					<Form.Input type="file" required={false} />
				</div>
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/if}
</FormTabContents>
