<script lang="ts">
	export let items: { id: string; name: string }[] = [];
	export let value = '';
	export let label = 'Choose...';

	let inputVal = '';

	function onItemClicked(item: string) {
		value = item;
		inputVal = '';
	}

	$: filteredItems = items?.filter(function (item) {
		return item.name.toLowerCase().includes(inputVal.toLowerCase());
	});
</script>

<div class="dropdown">
	<input class="input input-bordered" placeholder={label} bind:value />
	<ul
		class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto"
	>
		<li>
			<input class="w-full input input-bordered" placeholder="Search..." bind:value={inputVal} />
		</li>
		{#each filteredItems as { name, id } (id)}
			<li>
				<button on:click|preventDefault={() => onItemClicked(name)}>{name}</button>
			</li>
		{/each}
	</ul>
</div>
