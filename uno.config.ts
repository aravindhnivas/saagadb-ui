// uno.config.ts
import { defineConfig, presetIcons, presetUno } from 'unocss';
import { presetDaisy } from 'unocss-preset-daisy';
import extractorSvelte from '@unocss/extractor-svelte';
import transformerDirectives from '@unocss/transformer-directives';
import presetAnimations from 'unocss-preset-animations';
import { presetShadcn } from 'unocss-preset-shadcn';

export default defineConfig({
	presets: [
		presetIcons({
			scale: 1.5,
			extraProperties: {
				cursor: 'pointer'
			}
		}),
		presetUno(),
		presetDaisy(),
		presetAnimations(),
		presetShadcn({
			color: 'zinc'
		})
	],
	// By default, `.ts` and `.js` files are NOT extracted.
	// If you want to extract them, you can use the following configuration.
	// It's necessary to add following configuration if you are using shadcn-vue or shadcn-svelte.
	content: {
		pipeline: {
			include: [/\.(vue|svelte|[jt]s|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/]
		}
	},
	transformers: [transformerDirectives()],
	extractors: [extractorSvelte()]
});
