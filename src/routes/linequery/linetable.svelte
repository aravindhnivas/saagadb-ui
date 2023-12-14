<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	export let lines;

	const columns = [
		{
			title: 'Frequency',
			field: 'frequency'
		},
		{ title: 'Uncertainty', field: 'uncertainty' },
		{ title: 'Intensity', field: 'intensity' },
		{ title: 'Formula', field: 'name_formula', headerFilter: 'input' },
		{ title: 'IUPAC', field: 'iupac_name', headerFilter: 'input' },
		{ title: 'Measured', field: 'measured', formatter: 'tickCross' },
		{
			title: 'Rovibrational',
			field: 'rovibrational',
			formatter: 'tickCross'
		},
		{
			title: 'Hyperfine',
			field: 'hyperfine',
			formatter: 'tickCross'
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

	const mount = (node: HTMLDivElement) => {
		const tablulator_table = new Tabulator(node, {
			// layout: 'fitColumns',
			index: 'frequency',
			pagination: true,
			paginationMode: 'local',
			paginationSize: 10,
			paginationSizeSelector: [10, 25, 50, 100],
			paginationCounter: 'rows',
			movableColumns: true,
			// movableRows: true,
			groupBy: 'name_formula',
			data: lines,
			// reactiveData: true,
			// layout: 'fitDataTable', //fit columns to width of table (optional)
			columns: columns
		});
	};
</script>

<div role="alert" class="alert p-1 text-sm bg-yellow-200">
	<span>{`Data loaded. ${lines.length} lines found.`}</span>
</div>
<div use:mount />
