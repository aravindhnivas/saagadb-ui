<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	// console.log(data);
</script>

<pre>{JSON.stringify(data.meta_references, null, 2)}</pre>
<pre>{JSON.stringify(data.references, null, 2)}</pre>
