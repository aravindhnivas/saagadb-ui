interface TokenDecodedUser {
	user_approvers: string[];
	user: {
		id: number;
		name: string;
		email: string;
		organization: string;
		is_staff: boolean;
		is_superuser: boolean;
		is_active: boolean;
		is_verified: boolean;
		approver_name: string[];
	};
}

interface TokenDecoded extends TokenDecodedUser {
	token_type: 'refresh' | 'access';
	exp: number;
	iat: number;
	jti: string;
}
