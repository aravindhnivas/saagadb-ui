<script lang="ts">
	export let items = [
		'Afghanistan',
		'Albania',
		'Algeria',
		'Andorra',
		'Angola',
		'Anguilla',
		'Afghanistan',
		'Albania',
		'Algeria',
		'Andorra',
		'Angola',
		'Anguilla'
	];
	export let value = '';
	export let label = 'Choose...';
	let inputVal = '';
	function onItemClicked(item) {
		// document.activeElement?.blur();
		value = item;
		inputVal = '';
	}
	$: filteredItems = items?.filter(function (item) {
		return item.toLowerCase().includes(inputVal.toLowerCase());
	});

	// $: console.log(value);
</script>

<div class="dropdown">
	<input class="input input-bordered" placeholder={label} bind:value />
	<ul
		class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-80 flex-nowrap overflow-auto"
	>
		<li>
			<input class="w-full input input-bordered" placeholder="Search..." bind:value={inputVal} />
		</li>
		{#each filteredItems as item}
			<li>
				<button on:click={() => onItemClicked(item)}>{item}</button>
			</li>
		{/each}
	</ul>
</div>
