<script lang="ts">
	import { api_fields } from './api-fields';
	import { ArrowBigLeft } from 'lucide-svelte/icons';
	import type { ActionData, PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import SearchInput from '$lib/components/custom-input/search-input.svelte';
	import BoxContent from './box-content.svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';

	export let data: PageData;
	export let form: ActionData;

	const fields = api_fields[$page.params.apiName];
	const search_fields = fields.filter((field) => field.search_field).map((f) => f.name);

	let searchKey = '';

	$: filtered_data = data.metadata.filter((f) => {
		if (searchKey === '') return true;
		const val = search_fields
			.map((key) => {
				if (typeof f[key] === 'object') return JSON.stringify(f[key]).toLowerCase();
				return f[key].toLowerCase();
			})
			.join(' ');
		return val.includes(searchKey.toLowerCase());
	});

	$: if (form && form.success) toast.success(form.message);
	$: if (form && !form.success) toast.error(form.message);
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

	<form
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
		method="POST"
	>
		<div class="auto-fill">
			{#each filtered_data as metadata}
				<BoxContent {metadata} />
			{/each}
		</div>
	</form>
</div>

<style>
	.auto-fill {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		grid-gap: 1rem;
	}
</style>
