<script lang="ts">
	import type { LayoutData } from './$types';
	import { AlertCircle } from 'lucide-svelte/icons';
	import * as Alert from '$lib/components/ui/alert';
	import SpeciesLists from './species-lists.svelte';
	export let data: LayoutData;
</script>

<div class="flex gap-4 overflow-hidden">
	<div class="basis-1/4 p-4">
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
	</div>
	<div class="basis-3/4 p-4 overflow-auto"><slot /></div>
</div>
