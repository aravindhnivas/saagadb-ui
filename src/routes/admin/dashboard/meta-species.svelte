<script lang="ts">
	export let meta_species: SpeciesMetadata[];
	console.log({ meta_species });
</script>

<div class="stat">
	<div class="stat-title">Species-metadata</div>
	<div class="stat-value">
		{meta_species.filter((f) => !f.approved).length} pending approval
	</div>
	<div class="stat-desc">Total {meta_species.length} uploaded</div>
</div>
