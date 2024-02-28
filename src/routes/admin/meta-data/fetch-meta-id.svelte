<script lang="ts">
	import { getForm } from 'formsnap';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { oO } from '@zmotivat0r/o0';
	import { getContext, tick } from 'svelte';
	import { base } from '$app/paths';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Label } from '$lib/components/ui/label';
	import Svelecte from 'svelecte';

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
			const url = `${base}/api/data/species-metadata?species=${species_id}&linelist=${linelist_id}&hyperfine=${hyperfine}`;
			const res = await fetch(url);
			const data = (await res.json()) as Species[];
			// console.log({ url, species_id, linelist_id, data });
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
	let hyperfine = false;
</script>

<div class="grid-fit-content items-center">
	<div class="flex flex-col gap-1">
		<Label>species</Label>
		<Svelecte
			class="w-[150px]"
			virtualList={true}
			options={species.map((f) => ({
				id: f.id,
				label: f.name_formula
			}))}
			bind:value={species_id}
		/>
	</div>

	<div class="flex flex-col gap-1">
		<Label>linelist</Label>
		<Svelecte
			class="w-[150px]"
			virtualList={true}
			options={linelist.map((f) => ({
				id: f.id,
				label: f.linelist_name
			}))}
			bind:value={linelist_id}
		/>
	</div>

	<div class="flex items-center space-x-2">
		<Checkbox id="hyperfine" bind:checked={hyperfine} aria-labelledby="hyperfine-label" />
		<Label
			id="hyperfine-label"
			for="hyperfine"
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			hyperfine
		</Label>
	</div>
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
