<script lang="ts">
	import { api_fields } from './api-fields';
	import { ArrowBigLeft } from 'lucide-svelte/icons';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import SearchInput from '$lib/components/custom-input/search-input.svelte';
	import BoxContent from './box-content.svelte';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Label } from '$lib/components/ui/label';

	export let data: PageData;

	const fields = api_fields[$page.params.apiName];
	const search_fields = fields.filter((field) => field.search_field).map((f) => f.name);

	let searchKey = '';

	$: filtered_data = data.metadata
		.filter((f) => {
			if (searchKey === '') return true;
			const val = search_fields
				.map((key) => {
					if (typeof f[key] === 'object') return JSON.stringify(f[key]).toLowerCase();
					return f[key].toLowerCase();
				})
				.join(' ');
			return val.includes(searchKey.toLowerCase());
		})
		.filter((f) => {
			if (approved_status === 'all') return true;
			if (approved_status === 'approved') return f.approved;
			if (approved_status === 'not-approved') return !f.approved;
		});

	let approved_status = 'all';
	const approved_radio = [
		{
			value: 'all',
			label: 'All'
		},
		{
			value: 'approved',
			label: 'Approved'
		},
		{
			value: 'not-approved',
			label: 'NOT approved'
		}
	];
</script>

<Button
	variant="outline"
	class="w-[150px]"
	on:click={() => {
		history.back();
	}}
>
	<ArrowBigLeft /> Go back
</Button>

<div class="grid gap-4 px-2">
	<h1 class="text-xl font-medium text-center">
		{$page.params.apiName.toLocaleUpperCase()} : Uploaded by {data.metadata[0].uploaded_by_name}
	</h1>

	<SearchInput bind:searchKey />

	<RadioGroup.Root class="grid-cols-3 w-max" bind:value={approved_status}>
		{#each approved_radio as { label, value }}
			<div class="flex items-center space-x-2">
				<RadioGroup.Item {value} id={value} />
				<Label for={value}>{label}</Label>
			</div>
		{/each}
	</RadioGroup.Root>

	<div class="auto-fill">
		{#each filtered_data as metadata (metadata.id)}
			<BoxContent {metadata} />
		{/each}
	</div>
</div>

<style>
	.auto-fill {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		grid-gap: 1rem;
	}
</style>
