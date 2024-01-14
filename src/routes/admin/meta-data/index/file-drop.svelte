<script lang="ts">
	import { getForm } from 'formsnap';
	import Dropfile from '$lib/components/dropfile.svelte';
	import { Upload, File } from 'lucide-svelte';

	const { formId, form } = getForm();
	// console.log($form);
</script>

<Dropfile
	on:parsed={({ detail }) => {
		const keys = Object.keys(detail.parsed);
		// console.log({ detail, keys });
		keys.forEach((key) => {
			if (!Object.keys($form).includes(key)) return;
			$form[key] = detail.parsed[key];
		});
		console.log($formId, ' updated');
	}}
	let:fileOver
	let:filename
>
	<div class="flex items-center gap-2 space-y-2 cursor-pointer">
		{#if fileOver}
			<File />
			<span>Drop file here</span>
		{:else}
			<Upload />
			<span>Drag & drop or Upload file here</span>
		{/if}
		{#if filename}
			<em class=" text-gray-500">{filename}</em>
		{/if}
	</div>
</Dropfile>
