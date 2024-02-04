<script lang="ts">
	export let meta_ref: MetaReference[];
	console.log({ meta_ref });
</script>

<div class="stat">
	<div class="stat-title">References-metadata</div>
	<div class="stat-value">
		{meta_ref.filter((f) => !f.approved).length} pending approval
	</div>
	<div class="stat-desc">Total {meta_ref.length} uploaded</div>
</div>
