<script lang="ts">
	export let description: string = 'loading/fetching please wait...';
	export let fetching: boolean = false;

	let className = '';
	export { className as class };
</script>

{#if fetching}
	<div class="flex gap-2 items-center {className}">
		<span class="loading loading-spinner"></span>
		<span>{description}</span>
	</div>
{/if}
