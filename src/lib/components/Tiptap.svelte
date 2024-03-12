<script lang="ts">
	import StarterKit from '@tiptap/starter-kit';
	import Superscript from '@tiptap/extension-superscript';
	import Subscript from '@tiptap/extension-subscript';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';
	import { Redo, Undo, Bold, Italic, SuperscriptIcon, SubscriptIcon } from 'lucide-svelte/icons';

	export let content: string = '';
	export let setValue: (value: string) => void;
	let element: HTMLDivElement;
	let editor: Editor;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit, Superscript, Subscript],
			// content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
				content = editor.getHTML();
				if (content === '<p></p>') setValue?.('');
				else setValue?.(content);
			}
		});
	});
</script>

{#if editor}
	<div class="flex gap-2 items-center">
		<button
			class="{editor.isActive('bold') ? 'is-active' : ''} "
			on:click|preventDefault={() => editor.chain().focus().toggleBold().run()}
			disabled={!editor.can().chain().focus().toggleBold().run()}
		>
			<Bold />
		</button>

		<button
			class={editor.isActive('italic') ? 'is-active' : ''}
			on:click|preventDefault={() => editor.chain().focus().toggleItalic().run()}
			disabled={!editor.can().chain().focus().toggleItalic().run()}
		>
			<Italic />
		</button>

		<button
			class={editor.isActive('superscript') ? 'is-active' : ''}
			on:click|preventDefault={() => editor.chain().focus().toggleSuperscript().run()}
			disabled={!editor.can().chain().focus().toggleSuperscript().run()}
		>
			<SuperscriptIcon />
		</button>

		<button
			class={editor.isActive('subscript') ? 'is-active' : ''}
			on:click|preventDefault={() => editor.chain().focus().toggleSubscript().run()}
			disabled={!editor.can().chain().focus().toggleSubscript().run()}
		>
			<SubscriptIcon />
		</button>

		<button
			on:click|preventDefault={() => editor.chain().focus().undo().run()}
			disabled={!editor.can().chain().focus().undo().run()}
		>
			<Undo />
		</button>
		<button
			on:click|preventDefault={() => editor.chain().focus().redo().run()}
			disabled={!editor.can().chain().focus().redo().run()}
		>
			<Redo />
		</button>
	</div>
{/if}

<div bind:this={element} />
