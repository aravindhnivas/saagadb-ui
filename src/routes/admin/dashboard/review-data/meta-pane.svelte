<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { groupBy } from 'lodash-es';
	import * as Resizable from '$lib/components/ui/resizable';
	import ApproveMetadata from './approve-metadata.svelte';
	import { LockKeyhole, UnlockKeyhole } from 'lucide-svelte/icons';

	export let metadata: SpeciesMetadata[];
	export let include_keys: string[];
	export let api_key: string;

	setContext('include_keys', include_keys);
	setContext('api_key', api_key);

	const grouped_by_species_formula = groupBy(metadata, (f) => f.species_formula);

	let active_obj: SpeciesMetadata;
	let active_id: number;
</script>

<Resizable.PaneGroup direction="horizontal" class="rounded-lg border h-full">
	<Resizable.Pane defaultSize={25}>
		<div class="flex flex-col mr-2">
			<ul class="menu">
				{#each Object.keys(grouped_by_species_formula) as species_formula, ind}
					{@const species_name = grouped_by_species_formula[species_formula][0].species_name}
					<li>
						<details open={ind === 0}>
							<summary>{species_name} ({species_formula})</summary>
							<ul>
								{#each grouped_by_species_formula[species_formula] as obj}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
									<li
										class="cursor-pointer hover:underline rounded-md px-2"
										class:bg-orange={active_id === obj.id}
										on:click={() => {
											active_id = obj.id;
											active_obj = obj;
										}}
									>
										{obj.linelist_name.toLocaleUpperCase()} ({obj.molecule_tag})
									</li>
								{/each}
							</ul>
						</details>
					</li>
				{/each}
			</ul>
		</div>
	</Resizable.Pane>
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={75}>
		{#if active_obj}
			<div class="flex flex-col p-6">
				<div class="text-lg {active_obj.approved ? 'text-success' : 'text-blue'}">
					{active_obj.approved ? 'Approved' : 'Not-Approved yet'}
				</div>
				{#if active_obj.approved}
					<span class="text-lg text-blue">Entry already approved. Editting is not allowed.</span>
				{:else}
					<div class="flex gap-2 items-center text-sm text-gray">
						Click on <LockKeyhole /> to unlock <UnlockKeyhole /> the field for editing.
					</div>
				{/if}
				<ApproveMetadata obj={active_obj} />
			</div>
		{/if}
	</Resizable.Pane>
</Resizable.PaneGroup>
