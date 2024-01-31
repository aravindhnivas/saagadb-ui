<script>
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="hero bg-base-200 card shadow-xl h-full">
	<div class="hero-content text-center">
		<div class="">
			<h1 class="text-5xl font-bold">SAAGAdb</h1>
			<p class="py-6">
				The Species-agnostic Automated Gas Analyzer (SAAGA) project aims to automate the detection
				and characterization of chemical compounds in a complex chemical mixture of gas phase
				through experimental rotational spectroscopy and computational tools. A database of
				spectroscopic data serves as the foundation of the automation pipeline for assigning
				spectral lines to species. While there are existing databases available for use, we
				developed our custom database, named SAAGAdb, and an application programming interface (API)
				to access the database to fulfil the needs of SAAGA.
			</p>
			<Button><a href="{base}/species">Get Started</a></Button>
		</div>
	</div>
</div>
