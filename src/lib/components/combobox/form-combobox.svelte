<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import * as Form from '$lib/components/ui/form';
	export let items: {
		label: string;
		value: string;
	}[] = [];

	export let config;
	export let name: string;
	export let val_type: 'string' | 'number' = 'string';
	export let description: string = '';
	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Form.Field {config} {name} let:setValue let:value>
	<Form.Item class="flex flex-col">
		<Form.Label>{name}</Form.Label>

		<Popover.Root bind:open let:ids>
			<Popover.Trigger asChild let:builder>
				<Form.Control id={ids.trigger} let:attrs>
					<Button
						builders={[builder]}
						{...attrs}
						variant="outline"
						role="combobox"
						type="button"
						class={cn('w-[200px] justify-between', !value && 'text-muted-foreground')}
					>
						{items?.find((f) => f.value == value)?.label ?? `Select ${name}`}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Form.Control>
			</Popover.Trigger>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input placeholder="Search {name}..." />
					<Command.Empty>Not found</Command.Empty>
					<Command.Group>
						{#each items as item}
							<Command.Item
								value={item.value}
								onSelect={() => {
									if (val_type === 'number') {
										setValue(Number(item.value));
									} else {
										setValue(item.value);
									}

									closeAndFocusTrigger(ids.trigger);
								}}
							>
								<Check class={cn('mr-2 h-4 w-4', item.value !== value && 'text-transparent')} />
								{item.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
		{#if description}
			<Form.Description>{description}</Form.Description>
		{/if}
		<Form.Validation />
	</Form.Item>
</Form.Field>
