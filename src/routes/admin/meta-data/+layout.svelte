<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { metadata_items } from '$lib/schemas/metadata';
	import DropFile from '@svelte-parts/drop-file/DropFile.svelte';
	import { toast } from 'svelte-sonner';
	import { Upload, File } from 'lucide-svelte';
	import * as YAML from 'js-yaml';

	let value = metadata_items[0].value;
	let fileOver = false;
	let filename = '';

	const onDrop = async (files: File[]) => {
		if (!files.length) return;

		const file = files[0];
		filename = file.name;
		if (file.type !== 'application/x-yaml')
			return toast.error('Invalid file type. Please upload a YAML file.');

		try {
			const fileContents = await file.text();
			const parsed = YAML.load(fileContents) as Record<string, unknown>;
			console.log(parsed);
			toast.info(`Form updated using ${filename} file`);
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
			toast.error('Invalid YAML file. Please correct and try again.');
		}
	};
</script>

<!-- <DropFile {onDrop} onEnter={() => (fileOver = true)} onLeave={() => (fileOver = false)}>
	<div class="flex items-center gap-2 space-y-2 cursor-pointer">
		{#if fileOver}
			<File />
			<span>Drop file here</span>
		{:else}
			<Upload />
			<span>Drag & drop or Upload file here</span>
		{/if}
	</div>
</DropFile> -->
<Tabs.Root {value}>
	<Tabs.List class="grid w-full grid-cols-4">
		{#each metadata_items as { value, name }}
			<Tabs.Trigger {value}>{name}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	<slot />
</Tabs.Root>
