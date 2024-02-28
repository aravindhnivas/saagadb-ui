<script lang="ts">
	import { getForm } from 'formsnap';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { oO } from '@zmotivat0r/o0';

	const { form } = getForm();
	let ref_doi = '';

	async function fetch_ref_id(): Promise<string | number | undefined> {
		try {
			ref_doi = ref_doi.trim();
			if (!ref_doi) {
				toast.error('Please enter a reference doi');
				return;
			}
			fetching_ref_id = true;

			const res = await fetch(`/api/data/reference?doi=${ref_doi}`);
			const data = (await res.json()) as Reference[];
			if (data.length === 0) {
				toast.error('No reference found for this doi');
				return;
			}
			return data[0].id;
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		} finally {
			fetching_ref_id = false;
		}
	}
	let fetching_ref_id = false;
</script>

<div class="grid grid-cols-4 gap-4">
	<Input class="col-span-2" bind:value={ref_doi} placeholder="Enter reference doi" />
	<Button
		variant="outline"
		on:click={async () => {
			const [err, id] = await oO(fetch_ref_id());
			if (err instanceof Error) return toast.error(err.message);
			$form.ref = id;
		}}>Fetch ref_id</Button
	>
	{#if fetching_ref_id}
		<div class="flex gap-2 items-center h-10">
			<span class="loading loading-spinner"></span>
			<span>Fetching...</span>
		</div>
	{/if}
</div>
