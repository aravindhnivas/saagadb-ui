<script lang="ts">
	import { Download } from 'lucide-svelte/icons';
	import * as Table from '$lib/components/ui/table';
	import { onDestroy, onMount } from 'svelte';

	export let species: Species;
	export let user: User | null = null;

	let mol: ReturnType<typeof window.RDKit.get_mol>;
	// let mol_descriptor: MolecularDescriptor;
	let species_metadata_table: { [name: string]: string | number } = {};
	// console.log({ species });

	const load_all_data = () => {
		console.log('Loading all data');
		mol = window.RDKit.get_mol(species.smiles);
		// mol_descriptor = mol ? JSON.parse(mol.get_descriptors()) : null;

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

	let stage: NGL.Stage | null = null;
	let viewportElement: HTMLDivElement; // To bind the viewport div element

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
			const component = await stage.loadFile(stringBlob, { ext: 'pdb' });

			console.log('Structure loaded. Applying representation and centering...');

			// Apply representation (e.g., ball+stick)
			component.addRepresentation('ball+stick');

			// **Crucial Fixes:**
			// 1. Ensure NGL knows the viewport's current size
			stage.handleResize();
			// 2. Center the view on the loaded component
			component.autoView();

			// Optional: Add a small delay if centering is still off, might indicate
			// layout shifts happening after this code runs.
			// setTimeout(() => {
			//     if (stage && component) { // Check if still valid
			//        stage.handleResize();
			//        component.autoView(100); // Animate centering over 100ms
			//        console.log("Structure re-centered after delay.");
			//     }
			// }, 50); // Short delay (50ms)

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
		// Ensure the viewport element is ready
		if (!viewportElement) {
			console.error('Viewport element reference not available on mount.');
			return;
		}
		// species.pdb_data = '';
		console.log('Initializing NGL Stage...');
		stage = new NGL.Stage(viewportElement, {
			// Pass the element directly
			backgroundColor: 'white',
			tooltip: false // Disable NGL's default hover tooltips
			// tooltip: true
		});

		// Add resize listener
		window.addEventListener('resize', handleResize);

		load_all_data(); // Load data into the table

		// RDKit specific logic if needed
		// if (window.RDKit) {
		//     console.log('Loading RDKit related data...');
		//     load_all_data(); // Assuming this function exists elsewhere
		// }
	});

	onDestroy(() => {
		console.log('Destroying NGL Stage and removing listeners...');
		window.removeEventListener('resize', handleResize);
		if (stage) {
			stage.dispose(); // Clean up NGL resources
		}
		stage = null;
	});

	// Reactive statement to reload structure when the species prop changes
	$: if (stage && species && species.pdb_data) {
		console.log('Species prop changed, reloading structure...');
		loadStructureFromApi(species);
	}

	function downloadFileFromString(content: string, filename: string, contentType: string) {
		if (!content) {
			console.error('No content provided for download.');
			alert('Download failed: No data available.'); // Inform user
			return;
		}

		// 1. Create a Blob (Binary Large Object) from the string data
		const blob = new Blob([content], { type: contentType });

		// 2. Create a temporary URL pointing to the Blob
		const url = URL.createObjectURL(blob);

		// 3. Create a temporary anchor (<a>) element
		const a = document.createElement('a');
		a.href = url;
		a.download = filename; // This attribute suggests the filename to the browser

		// 4. Programmatically click the anchor element to trigger the download
		// Append to body to ensure visibility in all browsers, then click, then remove.
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		// 5. Clean up by revoking the object URL to free up memory
		URL.revokeObjectURL(url);

		console.log(`Download initiated for ${filename}`);
	}

	function handleDownloadClick() {
		// Use species.smiles for a more specific filename if available, otherwise use a default
		const filename = species?.smiles ? `${species.iupac_name}.pdb` : 'structure.pdb';
		// Call the helper function with the PDB data, desired filename, and MIME type
		downloadFileFromString(species.pdb_data ?? '', filename, 'text/plain;charset=utf-8');
		// Alternative MIME type for PDB: 'chemical/x-pdb' - 'text/plain' is generally safer
	}
</script>

{#if species}
	<div class="flex flex-col items-center max-w-4xl">
		<span class="text-2xl">{species.name[0]}</span>
		{#if species.name.length > 1}
			<span class="text-md font-300">({species.name.slice(1).join(', ')})</span>
		{/if}
	</div>

	<div class="grid grid-cols-2 gap-4 max-w-4xl">
		<div id="viewport" bind:this={viewportElement}></div>
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
	</div>

	{#if species.pdb_data}
		<button
			class="btn btn-sm"
			on:click={() => {
				handleDownloadClick();
			}}
		>
			<span>Download 3D-strucutre (.PDB)</span>
			<Download />
		</button>
	{/if}
{:else}
	<p>No species found</p>
{/if}

<style>
	#viewport {
		cursor: grab;
		width: 100%;
		height: 450px;
		border: 1px solid #ddd;
		border-radius: 4px;
		margin-bottom: 15px;
	}
</style>
