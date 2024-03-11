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
		<div class="l-pane flex flex-col mr-2">
			<ul class="menu">
				{#each Object.keys(grouped_by_species_formula) as species_formula, ind}
					{@const species_name = grouped_by_species_formula[species_formula][0].species_name}
					<!-- {@const title = `${species_name} (${species_formula})`} -->
					<li>
						<details open={ind === 0}>
							<summary>{species_formula}</summary>
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
			<div class="r-pane flex flex-col p-6">
				<div class="flex gap-2 items-center text-sm text-gray">
					<span>Approve {getContext('api_key')}.</span>
					Click on <LockKeyhole /> to unlock <UnlockKeyhole /> the field for editing.
				</div>

				<ApproveMetadata obj={active_obj} />
			</div>
		{/if}
	</Resizable.Pane>
</Resizable.PaneGroup>

<style>
	.r-pane,
	.l-pane {
		overflow: auto;
		min-height: 500px;
		max-height: calc(100vh - 100px);
	}
</style>
