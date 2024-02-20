import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import removeConsole from 'vite-plugin-remove-console';
import UnoCSS from 'unocss/vite';

export default defineConfig({
	plugins: [UnoCSS(), sveltekit(), removeConsole()]
});
