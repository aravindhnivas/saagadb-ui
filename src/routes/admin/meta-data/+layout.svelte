<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { metadata_items } from '$lib/schemas/metadata';
	let value = metadata_items[0].value;
	const width = {
		'3': 'w-lg',
		'4': 'w-xl',
		'5': 'w-2xl'
	};

	let className = `grid grid-cols-${metadata_items.length} ${width[metadata_items.length]}`;
</script>

<div class="flex flex-col gap-4 max-w-full">
	<Tabs.Root {value}>
		<Tabs.List class={className}>
			{#each metadata_items as { value, name }}
				<Tabs.Trigger {value}>{name}</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<slot />
	</Tabs.Root>
</div>
