<script lang="ts">
	import { getForm } from 'formsnap';
	import { Upload, File } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import DropFile from '@svelte-parts/drop-file/DropFile.svelte';
	import * as YAML from 'js-yaml';
	import { createEventDispatcher } from 'svelte';

	export let update_form = true;

	const { form } = getForm();
	const dispatch = createEventDispatcher();

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
			dispatch('parsed', { parsed });

			if (!update_form) return;
			if (!$form) throw toast.error('Form not found');

			const keys = Object.keys(parsed);
			keys.forEach((key) => {
				if (!Object.keys($form).includes(key)) return;
				$form[key] = parsed[key];
			});
			toast.info(`Form updated using ${filename} file`);
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
			toast.error('Invalid YAML file. Please correct and try again.');
		}
	};
</script>

<DropFile {onDrop} onEnter={() => (fileOver = true)} onLeave={() => (fileOver = false)}>
	<div class="flex items-center gap-2 space-y-2 cursor-pointer">
		{#if fileOver}
			<File />
			<span>Drop file here</span>
		{:else}
			<Upload />
			<span>Drag & drop or Upload file here</span>
		{/if}
	</div>
</DropFile>
{#if filename}
	<span class=" text-blue">{filename}</span>
{/if}
