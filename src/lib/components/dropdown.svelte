<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: { id: string; name: string }[] = [];
	export let value = 'None';
	export let label = 'Choose...';

	const dispatch = createEventDispatcher();
	let inputVal = '';

	function onItemClicked(item: string, id?: string) {
		value = item;
		inputVal = '';
		dispatch('selected', { item, id });
	}

	$: filteredItems = items?.filter(function (item) {
		return item.name.toLowerCase().includes(inputVal.toLowerCase());
	});
</script>

<div class="dropdown">
	<div class="w-full flex gap-4">
		<input tabindex="0" class="input input-bordered" placeholder={label} bind:value />
		<slot />
	</div>
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-70 max-h-80 flex-nowrap overflow-auto"
	>
		<li>
			<input class="w-full input input-bordered" placeholder="Search..." bind:value={inputVal} />
		</li>
		<li>
			<button on:click|preventDefault={() => onItemClicked('None')}>None</button>
		</li>
		{#each filteredItems as { name, id } (id)}
			<li>
				<button on:click|preventDefault={() => onItemClicked(name, id)}>{name}</button>
			</li>
		{/each}
	</ul>
</div>
