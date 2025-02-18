interface UploadCount {
	species: number;
	species_metadata: number;
	reference: number;
	meta_reference: number;
}

interface unapproved_counts {
	id: number;
	name: string;
	species_metadata: number;
	meta_reference: number;
}

interface UploadCountResponse {
	full: UploadCount;
	approved: UploadCount;
	unapproved_counts: unapproved_counts[];
}
