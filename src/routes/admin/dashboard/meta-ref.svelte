<script lang="ts">
	import StatComponent from './stat-component.svelte';
	import { BookMarked } from 'lucide-svelte';
	export let meta_ref: MetaReference[];
</script>

<StatComponent total={meta_ref.length} approved={meta_ref.filter((f) => f.approved).length}>
	<svelte:fragment slot="header">
		<BookMarked />
		<span>References-metadata</span>
	</svelte:fragment>
</StatComponent>
