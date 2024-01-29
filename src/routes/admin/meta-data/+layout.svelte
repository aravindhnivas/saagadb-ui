<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { metadata_items } from '$lib/schemas/metadata';
	import Dropfile from '$lib/components/file-drop.svelte';
	let value = metadata_items[0].value;
</script>

<!-- <Dropfile update_form={false} /> -->
<Tabs.Root {value}>
	<Tabs.List class="grid w-full grid-cols-4">
		{#each metadata_items as { value, name }}
			<Tabs.Trigger {value}>{name}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	<slot />
</Tabs.Root>
