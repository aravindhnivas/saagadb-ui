interface UploadCount {
	species: number;
	species_metadata: number;
	reference: number;
	meta_reference: number;
}

interface UploadCountResponse {
	full: UploadCount;
	approved: UploadCount;
}
