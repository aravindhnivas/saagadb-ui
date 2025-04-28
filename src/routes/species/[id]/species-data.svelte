<script lang="ts">
	import { Download } from 'lucide-svelte/icons';
	import * as Table from '$lib/components/ui/table';
	import { onDestroy, onMount } from 'svelte';
	import { Stage } from 'ngl';
	import type { Component } from 'ngl';

	export let species: Species;
	export let user: User | null = null;

	let mol: ReturnType<typeof window.RDKit.get_mol>;
	let species_metadata_table: { [name: string]: string | number } = {};
	// console.log({ species });

	const load_all_data = () => {
		console.log('Loading all data');
		mol = window.RDKit.get_mol(species.smiles);
		console.log('Loaded mol:', mol);
		species_metadata_table = {
			'IUPAC name': species.iupac_name,
			'Chemical formula': species.name_html,
			'Molar mass': Number(species.molecular_mass).toFixed(2) + ' g/mol',
			'Canonical SMILES': species.smiles,
			SMARTS: mol?.get_smarts() ?? '-',
			InChI: species.standard_inchi,
			InChIkey: species.standard_inchi_key,
			SELFIES: species.selfies,
			Notes: species.notes
		};
		if (user && user.is_staff) {
			species_metadata_table['uploaded_by'] = species.uploaded_by_name;
		}
		console.warn('Species metadata table:', species_metadata_table);
	};

	let stage: Stage | null = null;
	let component: Component | void;

	// --- Core Loading Function ---
	async function loadStructureFromApi(species: Species) {
		// Ensure stage is initialized and species data is valid
		if (!stage) {
			console.error('NGL Stage not initialized.');
			return;
		}
		const smiles = species.smiles;
		const pdbData = species.pdb_data;

		if (!smiles || !pdbData) {
			console.warn('Missing SMILES string or PDB data. Cannot load structure.');
			stage.removeAllComponents(); // Clear stage if showing previous structure
			// Optionally display a message in the viewport
			return;
		}

		console.log(`Loading structure for ${smiles}...`);
		stage.removeAllComponents(); // Clear previous structure

		try {
			console.log('Loading PDB data into viewer...');
			// Load the PDB data string into NGL using a Blob
			const stringBlob = new Blob([pdbData], { type: 'text/plain' });
			component = await stage.loadFile(stringBlob, { ext: 'pdb' });
			if (!component) {
				console.error('Failed to load component.');
				return;
			}
			console.log('Component loaded:', component);
			console.log('Structure loaded. Applying representation and centering...');

			component.addRepresentation('ball+stick', {
				// Optional: Customize representation settings here
				// color: 'element',
				// radiusScale: 1.5
			});
			// component.removeAllRepresentations();

			stage.handleResize();

			component.autoView();
			component.setScale(1.5); // Adjust scale as needed
			component.setVisibility(true); // Ensure visibility

			console.log(`Successfully loaded and centered structure for ${smiles}.`);
		} catch (error) {
			console.error('Error loading structure:', error);
			// Display error feedback to the user if desired
			if (stage) {
				stage.removeAllComponents(); // Clear stage on error
			}
		}
	}

	// Debounce function to limit resize calls
	function debounce(func: Function, wait: number) {
		let timeout: number | undefined;
		return function executedFunction(...args: any[]) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = window.setTimeout(later, wait);
		};
	}

	// Handle viewport resize
	const handleResize = debounce(() => {
		if (stage) {
			console.log('Handling resize...');
			stage.handleResize();
			// Optional: Recenter the first component if it exists
			const comp = stage.compList[0];
			if (comp) {
				comp.autoView(100); // Re-center smoothly
			}
		}
	}, 250); // Debounce resize calls by 250ms

	onMount(async () => {
		if (window.RDKit) load_all_data();
		if (!(species && species.smiles)) return;
		window.addEventListener('resize', handleResize);
	});

	onDestroy(() => {
		console.log('Destroying NGL Stage and removing listeners...');
		// window.removeEventListener('resize', handleResize);
		if (stage) {
			stage.dispose(); // Clean up NGL resources
		}
		stage = null;
		window.removeEventListener('resize', handleResize);
	});

	const init_ngl = (node: HTMLDivElement) => {
		console.log('Initializing NGL Stage...');

		stage?.dispose();
		stage = new Stage(node, {
			// Pass the element directly
			backgroundColor: 'white',
			tooltip: false // Disable NGL's default hover tooltips
			// tooltip: true
		});

		// Add resize listener
		// window.addEventListener('resize', handleResize);
		loadStructureFromApi(species);
	};
</script>

{#if species}
	<div class="flex flex-col items-center">
		<span class="text-2xl">{species.name[0]}</span>
		{#if species.name.length > 1}
			<span class="text-md font-300">({species.name.slice(1).join(', ')})</span>
		{/if}
	</div>
	<div class="grid grid-cols-3 gap-4">
		<Table.Root>
			<Table.Body>
				{#each Object.keys(species_metadata_table) as key}
					<Table.Row>
						<Table.Cell class="font-medium p-0.5">{key}</Table.Cell>
						<Table.Cell class="p-0.5">{@html species_metadata_table[key]}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		<div class="viewport" use:init_ngl></div>

		<div class="viewport flex justify-center items-center">
			{#if mol}
				<div>{@html mol.get_svg()}</div>
			{/if}
		</div>
	</div>

	<div class="flex-gap ml-auto">
		{#if species.pdb_data}
			{@const blob = new Blob([species.pdb_data], { type: 'text/plain' })}
			{@const url = URL.createObjectURL(blob)}
			<a class="btn btn-sm" href={url} download="{species.iupac_name}.pdb">
				<Download /> 3D (.PDB)
			</a>
		{/if}

		{#if mol}
			{@const svg = mol.get_svg()}
			{@const blob = new Blob([svg], { type: 'image/svg+xml' })}
			{@const url = URL.createObjectURL(blob)}
			<a class="btn btn-sm" href={url} download="{species.iupac_name}.svg">
				<Download /> 2D (.SVG)
			</a>
		{/if}
	</div>
{:else}
	<p>No species found</p>
{/if}

<style>
	.viewport {
		cursor: grab;
		border: solid 1px #ccc;
		border-radius: 15px;
	}
</style>
