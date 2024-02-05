<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';

	export let meta_ref: MetaReference[];
	export let meta_species: SpeciesMetadata[];
</script>

<Accordion.Root class="w-full sm:max-w-[70%]">
	<Accordion.Item value="item-2">
		<Accordion.Trigger>Show species-metadata</Accordion.Trigger>
		<Accordion.Content>
			Yes. It comes with default styles that matches the other components' aesthetic.
		</Accordion.Content>
	</Accordion.Item>
	<Accordion.Item value="item-1">
		<Accordion.Trigger>Show reference-metadata</Accordion.Trigger>
		<Accordion.Content>{meta_ref}</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
