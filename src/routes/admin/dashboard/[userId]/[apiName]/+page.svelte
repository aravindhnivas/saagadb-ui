<script lang="ts">
	import { api_fields } from './api-fields';
	import { AlertTriangle, ArrowBigLeft, CheckCheck } from 'lucide-svelte/icons';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;
	const fields = api_fields[$page.params.apiName];
	// console.log(data.metadata[0]);
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

<h1 class="text-xl font-medium text-center">
	Uploaded {$page.params.apiName} by {data.metadata[0].uploaded_by_name}
</h1>

<div class="auto-fill space-y-2">
	{#each data.metadata as metadata}
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

<style>
	.auto-fill {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
		grid-gap: 1rem;
	}
</style>
