<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import { base } from '$app/paths';
	import { getContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';

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

	// const new_obj = obj.map((f) => {
	// 	const new_val = Object.keys(f).map(k => ({key: k, value: f[k], checked: false}))
	// 	return new_val;
	// });

	console.log({ obj, grouped });

	const approve_btn = getContext('approve_btn');

	let message: string;
	const onSubmit = () => {
		return async ({ result }) => {
			console.log(result);
			if (result.type === 'success') {
				// rerun all `load` functions, following the successful update
				await invalidateAll();
				// console.log(result);
				const { data } = result;
				if (data.success) {
					toast.success(data.message);
				} else {
					message = data.message?.detail || data.message;
					toast.error(message);
				}
			}
			await applyAction(result);
		};
	};
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
								<Table.Head />
								{#each include_keys.map((f) => f.label) as label}
									<Table.Head class="p-0.5 text-center">{label}</Table.Head>
								{/each}
								{#if approve_btn}
									<Table.Head />
								{/if}
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each grouped[key] as obj}
								<Table.Row>
									<Table.Cell class="p-0.5 text-center">
										<div class="flex flex-col gap-4 items-center">
											<span>All</span>
											<Checkbox />
										</div>
									</Table.Cell>
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
												<div class="flex flex-col gap-4 items-center p-2">
													<span>{val ?? '-'}</span>
													{#if val}
														<Checkbox />
													{/if}
												</div>
											{/if}
										</Table.Cell>
									{/each}
									{#if approve_btn}
										<Table.Cell class="p-0.5 text-center">
											<form
												use:enhance={onSubmit}
												action="?/approve&id={obj.id}&api_key={api_key}"
												method="POST"
											>
												<Button type="submit">Approve</Button>
											</form>
										</Table.Cell>
									{/if}
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</Dialog.Content>
			</Dialog.Root>
		</li>
	{/each}
</div>
