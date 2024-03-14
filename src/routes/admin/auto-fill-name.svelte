<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Combobox from '$lib/components/combobox/combobox.svelte';
	import { getForm } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { base } from '$app/paths';
	import Loader from '$lib/components/utils/loader.svelte';
	import { browser } from '$app/environment';
	import { CDMS, JPL } from '$lib/utils/cdms-jpl-parser';
	import { sessionWritable, type PersistentStore } from '@macfja/svelte-persistent-store';
	import { onMount } from 'svelte';

	export let callback: (db: string, data: Object) => void;

	let className = '';
	export { className as class };

	// console.log('auto-fill-name', { browser });

	let database_type: PersistentStore<'cdms' | 'jpl'>;
	let molecule_tag: PersistentStore<string>;

	let mounted = false;
	onMount(() => {
		if (browser) {
			molecule_tag = sessionWritable<string>('molecule_tag', '');
			database_type = sessionWritable<'cdms' | 'jpl'>('database_type', 'cdms');
			// console.log('browser: auto-fill-name', { browser });
		}
		// console.log('mount: auto-fill-name', { browser });
		mounted = true;
	});

	const { reset } = getForm();
	let fetching = false;
	let status = '';
	let link = '';

	const fetch_from_database = async () => {
		if (!$molecule_tag) return toast.error('Please enter a molecule tag tag first');
		try {
			reset();
			status = '';
			fetching = true;
			if (!$molecule_tag) return toast.error('Please enter a molecule tag tag first');
			const res = await fetch(`${base}/api/${$database_type}/${$molecule_tag}`);
			if (!res.ok) return toast.error(await res.text());
			const { html_data, source_url } = await res.json();
			link = source_url;
			let fetched_data;
			if ($database_type === 'cdms') {
				fetched_data = await CDMS(html_data);
				// console.log({ fetched_data });
			} else if ($database_type === 'jpl') {
				fetched_data = await JPL(html_data);
			} else {
				throw new Error('Invalid database type');
			}
			status = 'Data fetched successfully';
			callback($database_type, fetched_data);
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
				status = error.message;
			}
		} finally {
			fetching = false;
		}
	};
</script>

{#if mounted}
	<div class="grid-fit-content items-end {className}">
		<Combobox
			label="database"
			items={[
				{ value: 'cdms', label: 'CDMS' },
				{ value: 'jpl', label: 'JPL' }
			]}
			bind:value={$database_type}
		/>
		<div class="flex flex-col gap-1">
			<Label>molecule tag</Label>
			<Input
				bind:value={$molecule_tag}
				placeholder="Enter molecule tag"
				on:keyup={async (e) => {
					if (e.key === 'Enter') {
						await fetch_from_database();
					}
				}}
			/>
		</div>
		<Button on:click={async () => await fetch_from_database()}>Fetch & auto-fill</Button>
		<Loader {fetching} />
		{#if !fetching && status && link}
			<p>{status}</p>
			<a href={link} target="_blank" rel="noopener noreferrer" class="underline"
				>{$database_type} source</a
			>
		{/if}
	</div>
{/if}
