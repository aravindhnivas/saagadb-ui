<script lang="ts">
	import { toast } from 'svelte-sonner';
	import DropFile from '@svelte-parts/drop-file/DropFile.svelte';
	import * as YAML from 'js-yaml';
	import { createEventDispatcher } from 'svelte';

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
			const parsed = YAML.load(fileContents);
			dispatch('parsed', { parsed });
			toast.info(`Loaded ${filename}`);
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
			toast.error('Invalid YAML file. Please correct and try again.');
		}
	};
</script>

<DropFile {onDrop} onEnter={() => (fileOver = true)} onLeave={() => (fileOver = false)}>
	<slot {fileOver} {filename} />
</DropFile>
