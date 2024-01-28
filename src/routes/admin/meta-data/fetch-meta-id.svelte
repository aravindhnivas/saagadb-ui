<script lang="ts">
	import { getForm } from 'formsnap';
	import Combobox from '$lib/components/combobox/combobox.svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { oO } from '@zmotivat0r/o0';
	import { getContext } from 'svelte';

	let species_id = 0;
	let linelist_id = 0;
	const species = getContext('species') as Species[];
	const linelist = getContext('linelist') as Linelist[];

	const { form } = getForm();

	async function fetch_meta_id(): Promise<string | number | undefined> {
		try {
			if (!(species_id && linelist_id)) {
				toast.error('Please select a species and linelist');
				return;
			}
			fetching_meta_id = true;
			const res = await fetch(
				`/api/data/species-metadata/query/?species_id=${species_id}&linelist_id=${linelist_id}`
			);
			const data = (await res.json()) as Species[];

			if (data.length === 0) {
				toast.error('No metadata found for this species and linelist');
				return;
			}
			return data[0].id;
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		} finally {
			fetching_meta_id = false;
		}
	}
	let fetching_meta_id = false;
</script>

<div class="grid grid-cols-4 gap-4 items-end">
	<Combobox
		label="species"
		items={species.map((f) => ({
			value: `${f.id}`,
			label: f.name_formula
		}))}
		on:change={(e) => {
			species_id = e.detail.value;
		}}
	/>
	<Combobox
		label="linelist"
		items={linelist.map((f) => ({
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
			$form.meta = id;
		}}>Fetch meta_id</Button
	>
	{#if fetching_meta_id}
		<div class="flex gap-2 items-center h-10">
			<span class="loading loading-spinner"></span>
			<span>Fetching...</span>
		</div>
	{/if}
</div>
