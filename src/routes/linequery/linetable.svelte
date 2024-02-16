<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	// import pkg from 'tabulator-tables';
	// const { TabulatorFull: Tabulator } = pkg;
	import type { OptionsColumns, OptionsData } from 'tabulator-tables';
	import { minMaxFilterEditor, minMaxFilterFunction } from './minmax-filter';
	import { writable } from '@macfja/svelte-persistent-store';

	export let lines: OptionsData['data'] = [];

	const columns: OptionsColumns['columns'] = [
		{
			title: 'Frequency (MHz)',
			field: 'frequency',
			width: 200
		},
		{
			title: 'Uncertainty (MHz)',
			field: 'uncertainty',
			sorter: 'number',
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false
		},
		{
			title: 'Intensity (nm<sup>2</sup> MHz)',
			field: 'intensity',
			width: 200,
			sorter: 'number',
			headerFilter: minMaxFilterEditor,
			headerFilterFunc: minMaxFilterFunction,
			headerFilterLiveFilter: false
		},
		{
			title: 'Formula',
			field: 'name_formula',
			headerFilter: 'input'
		},
		{
			title: 'IUPAC',
			field: 'iupac_name',
			headerFilter: 'input'
		},
		{
			title: 'Database',
			field: 'linelist',
			formatter: (cell) => cell.getValue().toUpperCase(),
			headerFilter: 'input'
		},
		// { title: 'Measured', field: 'measured', formatter: 'tickCross' },
		{
			title: 'Rovibrational',
			field: 'rovibrational',
			formatter: 'tickCross',
			headerFilter: 'tickCross'
		},
		{
			title: 'Hyperfine',
			field: 'hyperfine',
			formatter: 'tickCross',
			headerFilter: 'tickCross'
		},
		{
			title: 'Quantum Number ',
			columns: [
				{
					title: 'Lower State',
					field: 'lower_state_qn',
					formatter: (cell) => JSON.stringify(cell.getValue())
				},
				{
					title: 'Upper State',
					field: 'upper_state_qn',
					formatter: (cell) => JSON.stringify(cell.getValue())
				}
			]
		},
		{
			title: 'Energy levels (K)',
			columns: [
				{
					title: 'Lower State',
					field: 'lower_state_energy'
				},
				{ title: 'Upper State', field: 'upper_state_energy' }
			]
		},
		// { title: 'S_ij', field: 's_ij' },
		{ title: 'S_ij_mu2 (nm<sup>2</sup> )', field: 's_ij_mu2' },
		{ title: 'A_ij (s<sup>-1</sup> )', field: 'a_ij' }
	];

	let table: Tabulator;

	const mount = (node: HTMLDivElement) => {
		table = new Tabulator(node, {
			index: 'frequency',
			pagination: true,
			paginationMode: 'local',
			paginationSize: 10,
			paginationSizeSelector: [10, 15, 25, 50, 100],
			paginationCounter: 'rows',
			movableColumns: true,
			groupBy: $group_by_formula ? 'name_formula' : undefined,
			data: lines,
			columns: columns
			// history:true, //enable table state history
			// layout: 'fitDataTable', //fit columns to width of table (optional)
		});
	};
	const group_by_formula = writable('linequery__group_by_formula', false);
	let download_filename = 'line_data';
	const download_formats = ['xlsx', 'csv', 'json'] as const;
</script>

<div class="flex gap-2 items-center">
	<Checkbox
		bind:checked={$group_by_formula}
		onCheckedChange={(state) => {
			state ? table.setGroupBy(['name_formula']) : table.setGroupBy([]);
		}}
	/>
	<Label>Group by Species</Label>
	<div class="flex gap-4 ml-auto">
		{#each download_formats as format}
			<button
				class="btn btn-sm border-1 border-black"
				on:click={() => {
					try {
						table?.download(format, `${download_filename}.${format}`);
					} catch (error) {
						if (error instanceof Error) {
							toast.error(`Error: ${error.message}`);
						}
					}
				}}>Download as (.{format})</button
			>
		{/each}
	</div>
</div>

<div use:mount />
