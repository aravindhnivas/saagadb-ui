<script lang="ts">
	import type { LayoutData } from './$types';
	import { AlertCircle } from 'lucide-svelte/icons';
	import * as Alert from '$lib/components/ui/alert';
	import SpeciesLists from './species-lists.svelte';
	import * as Resizable from '$lib/components/ui/resizable';
	export let data: LayoutData;
</script>

<Resizable.PaneGroup direction="horizontal" class="rounded-lg border h-full">
	<Resizable.Pane defaultSize={20} class="w-full p-4 overflow-auto">
		{#await data.load}
			<div class="flex gap-2 items-center">
				<span class="loading loading-spinner"></span>
				<span>Fetching data please wait...</span>
			</div>
		{:then { species }}
			<SpeciesLists {species} />
		{:catch error}
			<Alert.Root variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<Alert.Title>Error</Alert.Title>
				<Alert.Description>{error?.message ?? error}</Alert.Description>
			</Alert.Root>
		{/await}
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={80} class="p-4">
		<div
			class="grid gap-4 h-full overflow-auto w-full items-start px-5"
			style="grid-template-rows: auto auto 1fr;"
		>
			<slot />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
