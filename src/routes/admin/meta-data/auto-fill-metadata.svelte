<script lang="ts">
	import { getForm } from 'formsnap';
	import AutoFillName from '../auto-fill-name.svelte';

	const { form } = getForm();
	const callback = (db: string, data: Object) => {
		console.log({ db, data, form });
	};
</script>

<AutoFillName {callback} />
