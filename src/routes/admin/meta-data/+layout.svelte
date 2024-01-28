<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { metadata_items } from '$lib/schemas/metadata';
	let value = metadata_items[0].value;
</script>

<Tabs.Root {value}>
	<Tabs.List class="grid w-full grid-cols-4">
		{#each metadata_items as { value, name }}
			<Tabs.Trigger {value}>{name}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	<slot />
</Tabs.Root>
