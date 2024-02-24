<script>
	import { base } from '$app/paths';
	import { Button } from '$lib/components/ui/button';
	import { ArrowRightCircle } from 'lucide-svelte/icons';
</script>

<div class="hero card shadow-xl h-full">
	<div class="hero-content text-center">
		<div class="">
			<h1 class="text-5xl font-bold">SAAGAdb</h1>
			<p class="py-6">
				The Species-agnostic Automated Gas Analyzer (SAAGA). A database of spectroscopic data serves
				as the foundation of the automation pipeline for assigning spectral lines to species. While
				there are existing databases available for use, we developed our custom database, named
				SAAGAdb, and an application programming interface (API) to access the database to fulfil the
				needs of SAAGA.
			</p>
			<Button variant="outline">
				<a class="flex items-center gap-4" href="{base}/species">
					<span>Get Started</span>
					<ArrowRightCircle />
				</a>
			</Button>
		</div>
	</div>
</div>
