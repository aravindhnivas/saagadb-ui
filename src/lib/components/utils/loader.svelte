<script lang="ts">
	export let description: string = 'loading/fetching please wait...';
</script>

<div class="flex gap-2 items-center">
	<span class="loading loading-spinner"></span>
	<span>{description}</span>
</div>
