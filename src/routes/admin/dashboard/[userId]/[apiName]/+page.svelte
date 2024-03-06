<script lang="ts">
	import { ArrowBigLeft } from 'lucide-svelte/icons';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;
</script>

<Button
	variant="outline"
	class="w-[150px]"
	on:click={() => {
		history.back();
	}}
>
	<ArrowBigLeft /> Go back
</Button>

<pre>
    {JSON.stringify(data.metadata, null, 2)}
</pre>
