<script lang="ts">
	import type { PageData } from './$types';
	import { setContext } from 'svelte';
	import FormDirectReference from './form-direct-reference.svelte';
	import FormLine from './form-line.svelte';
	import FormSpeciesMetadata from './form-species-metadata.svelte';
	// import FormReference from './form-reference.svelte';
	// import FormMetaReference from './form-meta-reference.svelte';

	export let data: PageData;
	setContext('species', data.species);
	setContext('linelist', data.linelist);
</script>

<FormSpeciesMetadata form={data.forms['species-metadata']} />
<FormLine form={data.forms['line']} />
<FormDirectReference form={data.forms['direct-reference']} />
<!-- <FormReference form={data.forms['reference']} />
<FormMetaReference form={data.forms['meta-reference']} /> -->
