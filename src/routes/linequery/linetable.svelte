<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Tabulator } from 'tabulator-tables';
	export let lines;
	// console.log(lines);
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

	const columns = [
		{ title: 'Frequency', field: 'frequency' },
		{ title: 'Uncertainty', field: 'uncertainty' },
		{ title: 'Intensity', field: 'intensity' },
		{ title: 'Formula', field: 'name_formula' },
		{ title: 'IUPAC', field: 'iupac_name' },
		{ title: 'Measured', field: 'measured' },
		{ title: 'Rovibrational', field: 'rovibrational' },
		{ title: 'Hyperfine', field: 'hyperfine' },
		// { title: 'Lower State QN', field: 'lower_state_qn' },
		// { title: 'Upper State QN', field: 'upper_state_qn' },
		{ title: 'Lower State Energy', field: 'lower_state_energy' },
		{ title: 'Upper State Energy', field: 'upper_state_energy' },
		// { title: 'S_ij', field: 's_ij' },
		{ title: 'S_ij_mu2', field: 's_ij_mu2' },
		{ title: 'A_ij', field: 'a_ij' }
		// {title: 'Name', field: 'name'},
		// {title: 'Molecule Tag', field: 'molecule_tag'},
		// {title: 'Linelist', field: 'linelist'},
		// {title: 'Meta ID', field: 'meta_id'},
		// {title: 'SMILES', field: 'smiles'},
		// {title: 'SELFIES', field: 'selfies'}
	];

	let tablulator_table: Tabulator;
	let data_loaded = false;
	const mount = (node: HTMLDivElement) => {
		// console.log(lines[0]);
		tablulator_table = new Tabulator(node, {
			data: [], //assign data to table
			layout: 'fitDataTable', //fit columns to width of table (optional)
			columns: columns
		});
		tablulator_table.on('dataLoading', (data) => {
			data_loaded = false;
			console.warn('data loading', data);
		});
		tablulator_table.on('dataProcessed', () => {
			data_loaded = true;
			console.log('data processed');
		});
	};

	$: if (tablulator_table && data_loaded && lines?.length > 0) {
		tablulator_table.replaceData(lines);
	}

	onDestroy(() => {
		tablulator_table?.off('dataLoading');
		tablulator_table?.off('dataProcessed');
	});
</script>

<div role="alert" class="alert alert-info p-1">
	<span>Total {lines.length} lines queried</span>
</div>
<div use:mount />
