<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	// import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';

	export let is_link: boolean;
	export let value: string;
	export let checked: boolean = false;
</script>

<Table.Cell class="p-0.5 text-center">
	{#if is_link}
		<a href={value} target="_blank" rel="noopener noreferrer" class="text-blue-500">
			{value}
		</a>
	{:else}
		<div class="flex flex-col gap-1 items-center p-2">
			<span>{value ?? '-'}</span>
			<!-- <Input {value} /> -->
			<Checkbox bind:checked />
		</div>
	{/if}
</Table.Cell>
