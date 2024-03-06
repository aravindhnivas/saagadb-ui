<script lang="ts">
	import { api_fields } from './api-fields';
	import { AlertTriangle, ArrowBigLeft, CheckCheck } from 'lucide-svelte/icons';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import * as Table from '$lib/components/ui/table';
	import SearchInput from '$lib/components/custom-input/search-input.svelte';

	export let data: PageData;
	const fields = api_fields[$page.params.apiName];
	let searchKey = '';

	const search_fields = fields.filter((field) => field.search_field).map((f) => f.name);

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

	<div class="auto-fill space-y-2">
		{#each filtered_data as metadata}
			<div class="grid border-solid border-2 p-5">
				<Table.Root class="text-md max-w-2xl">
					<Table.Body>
						{#each fields as { name, label }}
							<Table.Row>
								{#if name === 'approved'}
									{#if metadata[name]}
										<Table.Cell class="p-0.5 text-green-700"><CheckCheck /></Table.Cell>
										<Table.Cell class="p-0.5 text-green-700">APPROVED</Table.Cell>
									{:else}
										<Table.Cell class="p-0.5 text-red"><AlertTriangle /></Table.Cell>
										<Table.Cell class="p-0.5 text-red">PENDING APPROVAL</Table.Cell>
									{/if}
								{:else}
									<Table.Cell class="p-0.5">{@html label}</Table.Cell>
									<Table.Cell class="p-0.5">
										{metadata[name] ?? '-'}
									</Table.Cell>
								{/if}
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
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
