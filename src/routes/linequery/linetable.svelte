<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onDestroy } from 'svelte';
	export let lines;
	console.log(lines[0]);
	let status = '';
	// let tableComponent: Tabulator;
	const columns = [
		{ title: 'Frequency', field: 'frequency' },
		{ title: 'Uncertainty', field: 'uncertainty' },
		{ title: 'Intensity', field: 'intensity' },
		{ title: 'Formula', field: 'name_formula' },
		// { title: 'IUPAC', field: 'iupac_name' },
		{ title: 'Measured', field: 'measured', formatter: (cell) => (cell.getValue() ? '✔️' : '❌') },
		{
			title: 'Rovibrational',
			field: 'rovibrational',
			formatter: (cell) => (cell.getValue() ? '✔️' : '❌')
		},
		{
			title: 'Hyperfine',
			field: 'hyperfine',
			formatter: (cell) => (cell.getValue() ? '✔️' : '❌')
		},
		{
			title: 'Lower State QN',
			field: 'lower_state_qn',
			formatter: (cell) => JSON.stringify(cell.getValue())
		},
		{
			title: 'Upper State QN',
			field: 'upper_state_qn',
			formatter: (cell) => JSON.stringify(cell.getValue())
		},
		{
			title: 'Lower State Energy',
			field: 'lower_state_energy'
		},
		{ title: 'Upper State Energy', field: 'upper_state_energy' },
		{ title: 'S_ij', field: 's_ij' },
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
		tablulator_table = new Tabulator(node, {
			// layout: 'fitColumns',
			index: 'frequency',
			pagination: true,
			paginationMode: 'local',
			paginationSize: 10,
			paginationSizeSelector: [10, 25, 50, 100],
			movableColumns: true,
			paginationCounter: 'rows',
			// data: lines,
			// reactiveData: true,
			// layout: 'fitDataTable', //fit columns to width of table (optional)
			columns: columns
		});
		tablulator_table.on('dataLoading', () => {
			data_loaded = false;
			console.warn('data loading');
		});
		tablulator_table.on('dataProcessed', () => {
			data_loaded = true;
			status = `Data loaded. ${lines.length} lines found.`;
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

<div role="alert" class="alert alert-link p-1 text-sm">
	<span>{`Data loaded. ${lines.length} lines found.`}</span>
</div>
<div use:mount />
