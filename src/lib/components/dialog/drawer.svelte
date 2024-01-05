<script lang="ts">
	import { Drawer } from 'vaul-svelte';

	export let title: string = 'Information';
	export let content: string = '';
</script>

<Drawer.Root shouldScaleBackground>
	<Drawer.Trigger>Open Drawer</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Overlay class="fixed inset-0 bg-black/40" />
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-zinc-100"
		>
			<div class="flex-1 rounded-t-[10px] bg-white p-4">
				<div class="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
				<div class="mx-auto max-w-md">
					<Drawer.Title class="mb-4 font-medium">{title}</Drawer.Title>
					<p class="mb-2 text-zinc-600">
						{content}
					</p>
				</div>
			</div>
			<div class="mt-auto border-t border-zinc-200 bg-zinc-100 p-4">
				<div class="mx-auto flex max-w-md justify-end gap-6">
					<slot name="footer" />
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
