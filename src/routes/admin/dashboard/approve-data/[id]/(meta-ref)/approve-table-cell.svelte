<script lang="ts">
	import { edit_ref_field } from '../stores';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	export let is_link: boolean;
	export let key: string;
	export let value: string | boolean;
	export let formatted_value: string | boolean;
	export let checked: boolean = false;
	export let editable: boolean = true;

	// console.log(key, value);
</script>

<Table.Cell class="p-0.5 text-center">
	{#if is_link && typeof value === 'string'}
		{#if $edit_ref_field && editable}
			<Input name={key} bind:value />
		{:else}
			<div class="flex gap-4 items-center">
				<Checkbox bind:checked />
				<a href={value} target="_blank" rel="noopener noreferrer" class="text-blue-500">
					{value}
				</a>
			</div>
		{/if}
	{:else}
		<div class="flex flex-col gap-1 items-center p-2">
			{#if $edit_ref_field && editable}
				{#if typeof value === 'boolean'}
					<input type="checkbox" name={key} bind:checked={value} class="checkbox" />
					<!-- <Checkbox name={key} bind:checked={value} /> -->
				{:else if typeof value === 'string'}
					{#if key === 'notes'}
						<Textarea name={key} bind:value />
					{:else}
						<Input name={key} bind:value />
					{/if}
				{/if}
			{:else}
				<span>{formatted_value}</span>
				<Checkbox bind:checked />
			{/if}
		</div>
	{/if}
</Table.Cell>
