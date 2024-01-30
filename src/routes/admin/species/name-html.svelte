<script lang="ts">
	import { getForm } from 'formsnap';

	const { form } = getForm();
</script>

<span>{@html $form.name_html}</span>
