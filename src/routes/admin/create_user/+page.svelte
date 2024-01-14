<script lang="ts">
	import { Eye, EyeOff } from 'lucide-svelte';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import FormComponent from '$lib/components/forms/form-component.svelte';
	import userSchema from './schema';

	export let data: PageData;
	let show_password = false;
</script>

<FormComponent schema={userSchema} form={data.form} let:config>
	{#each Object.keys(data.form.data) as name}
		<Form.Field {config} {name}>
			<Form.Item>
				<Form.Label>{name}</Form.Label>
				{#if name === 'password'}
					<!-- svelte-ignore a11y-interactive-supports-focus -->
					<div class="flex items-center gap-1">
						<Form.Input type={show_password ? 'text' : 'password'} />
						<!-- svelte-ignore a11y-interactive-supports-focus -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<span class="cursor-pointer" on:click={() => (show_password = !show_password)}>
							{#if show_password}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</span>
					</div>
				{:else}
					<Form.Input />
				{/if}
				<Form.Validation />
			</Form.Item>
		</Form.Field>
	{/each}
</FormComponent>
