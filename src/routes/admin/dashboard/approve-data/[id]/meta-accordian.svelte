<script lang="ts">
	import { setContext } from 'svelte';
	import { groupBy } from 'lodash-es';
	import * as Accordion from '$lib/components/ui/accordion';
	import MetaItemsDialog from './meta-items-dialog.svelte';

	export let metadata: SpeciesMetadata[];
	export let include_keys: string[];
	export let api_key: string;

	setContext('include_keys', include_keys);
	setContext('api_key', api_key);

	const grouped_by_species_formula = groupBy(metadata, (f) => f.species_formula);
</script>

{#each Object.keys(grouped_by_species_formula) as species_formula}
	{@const species_name = grouped_by_species_formula[species_formula][0].species_name}
	{@const title = `${species_name} (${species_formula})`}
	<Accordion.Root class="w-full sm:max-w-[70%]">
		<Accordion.Item value={species_formula}>
			<Accordion.Trigger>{title}</Accordion.Trigger>
			<Accordion.Content>
				<div class="rounded-box max-w-lg">
					{#each grouped_by_species_formula[species_formula] as obj}
						<li class="hover:bg-gray-200 cursor-pointer rounded-4">
							<MetaItemsDialog {obj} {title} />
						</li>
					{/each}
				</div>
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
{/each}
