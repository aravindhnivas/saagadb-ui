<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { base } from '$app/paths';

	export let api_key: 'meta-reference' | 'species-metadata' = 'species-metadata';
	export let obj: SpeciesMetadata[] | MetaReference[];
	export let include_keys: {
		key: string;
		label: string;
		is_link?: Boolean;
		formatter?: <T>(val: T) => string;
		href?: string;
	}[];

	const grouped: {
		[key: string]: typeof obj;
	} = Object.groupBy(obj, (f) => f.species_formula);
</script>

<div class="rounded-box max-w-lg">
	{#each Object.keys(grouped) as key}
		{@const species_name = grouped[key][0].species_name}
		<li class="hover:bg-base-200">
			<Dialog.Root>
				<Dialog.Trigger>{species_name} ({key})</Dialog.Trigger>
				<Dialog.Content class="max-w-[70%] sm:max-w-[90%]">
					<Dialog.Header>
						<Dialog.Title>{key} ({species_name})</Dialog.Title>
						<Dialog.Description>Check and approve the data</Dialog.Description>
					</Dialog.Header>
					<Table.Root class="text-md">
						<Table.Header>
							<Table.Row>
								{#each include_keys.map((f) => f.label) as label}
									<Table.Head class="p-0.5 text-center">{label}</Table.Head>
								{/each}
								<Table.Head />
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each grouped[key] as obj}
								<Table.Row>
									{#each include_keys.map(({ label, ...f }) => f) as k}
										{@const val = k.formatter?.(obj[k.key]) ?? obj[k.key]}
										<Table.Cell class="p-0.5 text-center">
											{#if k.is_link}
												<a
													href={val}
													target="_blank"
													rel="noopener noreferrer"
													class="text-blue-500"
												>
													{val}
												</a>
											{:else}
												{val ?? '-'}
											{/if}
										</Table.Cell>
									{/each}
									<Table.Cell class="p-0.5 text-center">
										<form action="{base}/api/data/{api_key}" method="PATCH">
											<Button type="submit">Approve</Button>
										</form>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
					<!-- <Dialog.Footer>
						<Button type="submit">Save changes</Button>
					</Dialog.Footer> -->
				</Dialog.Content>
			</Dialog.Root>
		</li>
	{/each}
</div>
