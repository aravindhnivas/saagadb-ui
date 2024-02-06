<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';

	export let meta_ref: MetaReference[];
	const meta_ref_grouped = Object.groupBy(meta_ref, (f) => f.species_formula);
</script>

<ul class="menu w-56 rounded-box">
	<!-- <li class="menu-title">Title</li> -->
	<li>
		{#each Object.keys(meta_ref_grouped) as key, ind}
			<Dialog.Root>
				<Dialog.Trigger>{ind + 1}: {key}</Dialog.Trigger>
				<Dialog.Content class="max-w-[70%]">
					<Dialog.Header>
						<Dialog.Title>{key}</Dialog.Title>
						<Dialog.Description>Check and approve the data</Dialog.Description>
					</Dialog.Header>
					<Table.Root class="text-md">
						<Table.Header>
							<Table.Row>
								<Table.Head class="p-0.5">ID</Table.Head>
								<Table.Head class="p-0.5">Spectrum</Table.Head>
								<Table.Head class="p-0.5">Dipole moment</Table.Head>
								<Table.Head class="p-0.5">Linelist name</Table.Head>
								<Table.Head class="p-0.5">Species name</Table.Head>
								<Table.Head class="p-0.5">Reference URL</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each meta_ref_grouped[key] as obj}
								<Table.Row>
									<Table.Cell class="p-0.5">{obj.id}</Table.Cell>
									<Table.Cell class="p-0.5">{obj.spectrum}</Table.Cell>
									<Table.Cell class="p-0.5">{obj.dipole_moment}</Table.Cell>
									<Table.Cell class="p-0.5">{obj.linelist_name}</Table.Cell>
									<Table.Cell class="p-0.5">{obj.species_name}</Table.Cell>
									<Table.Cell class="p-0.5">{obj.ref_url}</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
					<Dialog.Footer>
						<Button type="submit">Save changes</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{/each}
	</li>
</ul>
