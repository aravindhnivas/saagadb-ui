<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import type { OptionsColumns, OptionsData } from 'tabulator-tables';

	export let lines: OptionsData['data'] = [];

	const columns: OptionsColumns['columns'] = [
		{
			title: 'Frequency',
			field: 'frequency'
		},
		{ title: 'Uncertainty', field: 'uncertainty' },
		{ title: 'Intensity', field: 'intensity' },
		{
			title: 'Formula',
			field: 'name_formula'
			// headerFilter: 'input'
		},
		{
			title: 'IUPAC',
			field: 'iupac_name'
			// headerFilter: 'input'
		},
		{
			title: 'Database',
			field: 'linelist',
			formatter: (cell) => cell.getValue().toUpperCase(),
			headerFilter: 'input'
		},
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
		// { title: 'Molecule Tag', field: 'molecule_tag' }
		// { title: 'Meta ID', field: 'meta_id' }
		// {title: 'SMILES', field: 'smiles'},
		// { title: 'SELFIES', field: 'selfies' }
	];

	const mount = (node: HTMLDivElement) => {
		new Tabulator(node, {
			index: 'frequency',
			pagination: true,
			paginationMode: 'local',
			paginationSize: 10,
			paginationSizeSelector: [10, 15, 25, 50, 100],
			paginationCounter: 'rows',
			movableColumns: true,
			groupBy: 'name_formula',
			data: lines,
			columns: columns
			// layout: 'fitDataTable', //fit columns to width of table (optional)
		});
	};
</script>

<div use:mount />
