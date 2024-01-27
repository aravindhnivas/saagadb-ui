<script lang="ts">
	import { getForm } from 'formsnap';
	import Combobox from '$lib/components/combobox/combobox.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { oO } from '@zmotivat0r/o0';

	export let species: Species[];
	export let linelist: Linelist[];
	// export let include_ref = false;
	export let metaid: string;

	let species_id = 0;
	let linelist_id = 0;
	let ref_doi = '';

	const { form } = getForm();

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

{#if metaid === 'meta-reference' || metaid === 'line'}
	<div class="grid gap-2 border-gray border-2 p-2 rounded-4">
		<div class="flex gap-2 items-end">
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
		</div>
		{#if metaid === 'meta-reference'}
			<div class="flex gap-2">
				<Input bind:value={ref_doi} placeholder="Enter reference doi" />
				<Button
					variant="outline"
					on:click={async () => {
						const [err, id] = await oO(fetch_ref_id());
						if (err instanceof Error) return toast.error(err.message);
						$form.ref = id;
					}}>Fetch ref_id</Button
				>
			</div>
		{/if}
	</div>
{/if}
