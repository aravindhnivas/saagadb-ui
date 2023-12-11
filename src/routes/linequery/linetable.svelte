<script>
	export let lines = [];
	console.log(lines);

	const headers = [
		'frequency',
		'uncertainty',
		'intensity',
		'name_formula',
		'iupac_name',
		'measured',
		'rovibrational',
		'hyperfine',
		'lower_state_qn',
		'upper_state_qn',
		'lower_state_energy',
		'upper_state_energy',
		's_ij',
		's_ij_mu2',
		'a_ij'

		// 'name',
		// 'molecule_tag',
		// 'linelist',
		// 'meta_id',
		// 'smiles',
		// 'selfies'
	];
</script>

<div class="overflow-x-auto">
	<table class="table table-xs table-pin-rows table-pin-cols">
		<thead>
			<tr>
				<th></th>
				{#each headers as item}
					<th>{item}</th>
				{/each}
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each lines as line, ind}
				<tr>
					<th>{ind}</th>
					{#each headers as item}
						{#if typeof line[item] === 'object'}
							<td>{JSON.stringify(line[item])}</td>
						{:else if typeof line[item] === 'boolean'}
							<td><input disabled type="checkbox" checked={line[item]} class="checkbox" /></td>
						{:else}
							<td>{line[item]}</td>
						{/if}
					{/each}
					<th>{ind}</th>
				</tr>
			{/each}
		</tbody>

		<tfoot>
			<tr>
				<th></th>
				{#each headers as item}
					<th>{item}</th>
				{/each}
				<th></th>
			</tr>
		</tfoot>
	</table>
</div>
