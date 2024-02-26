<script lang="ts">
	import { Search } from 'lucide-svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	export let searchKey = '';
</script>

<div class="relative h-10 w-full">
	<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
	<Input
		type="text"
		placeholder="Search here..."
		class="pl-10 pr-3 py-2 text-md w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
		bind:value={searchKey}
	/>
</div>
