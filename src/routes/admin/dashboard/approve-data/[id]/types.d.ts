interface MetaRefApprovalItem {
	key: keyof MetaReference;
	label: string;
	formatter?: <T>(val: T) => string;
	is_link?: boolean;
	href?: string;
	editable?: boolean;
}
