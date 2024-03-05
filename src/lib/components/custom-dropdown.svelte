<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { tick } from 'svelte';

	export let items: {
		label: string;
		value: string | number;
		checked: boolean;
	}[] = [];
	export let label: string;
	export let selected_values: string[] | number[] = [];

	// console.log(items);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="outline" builders={[builder]} class="mb-2">Select {label}</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56 overflow-auto max-h-[200px]">
		<DropdownMenu.Label>{label}</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each items as item}
			<DropdownMenu.CheckboxItem
				bind:checked={item.checked}
				onCheckedChange={async () => {
					await tick();
					selected_values = items.filter((f) => f.checked).map((f) => f.value);
				}}
			>
				{item.label}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
