<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { LockKeyhole, UnlockKeyhole } from 'lucide-svelte';
	import ApproveMetadata from './approve-metadata.svelte';
	import { getContext } from 'svelte';

	export let obj: SpeciesMetadata | MetaReference;
	export let title: string;

	let dialogOpen = false;
</script>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Trigger>
		{obj.linelist_name.toLocaleUpperCase()} ({obj.molecule_tag})
	</Dialog.Trigger>
	<Dialog.Content class="max-w-[70%] sm:max-w-[90%] max-h-[70%] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>
				{title} metadata from
				{obj.linelist_name.toLocaleUpperCase()} ({obj.molecule_tag})
			</Dialog.Title>
			<Dialog.Description>
				<div class="flex gap-2 items-center">
					<span>Approve {getContext('api_key')}.</span>
					Click on <LockKeyhole /> to unlock <UnlockKeyhole /> the field for editing.
				</div>
			</Dialog.Description>
		</Dialog.Header>
		<ApproveMetadata {obj} />
	</Dialog.Content>
</Dialog.Root>
