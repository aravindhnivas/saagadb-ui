<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { LockKeyhole, UnlockKeyhole } from 'lucide-svelte';
	import ApproveSpeciesMetadata from './approve-species-metadata.svelte';

	export let obj: SpeciesMetadata;
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
				<div class="flex gap-4 items-center">
					<span>Approve species metadata.</span>
					Click on <LockKeyhole /> to unlock <UnlockKeyhole /> the field for editing.
				</div>
			</Dialog.Description>
		</Dialog.Header>
		<ApproveSpeciesMetadata
			{obj}
			on:approve={() => {
				dialogOpen = false;
			}}
		/>
	</Dialog.Content>
</Dialog.Root>
