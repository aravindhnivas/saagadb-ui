interface TokenDecodedUser {
	user_id: number;
	user_approvers: string[];
	user: {
		id: number;
		name: string;
		email: string;
		organization: string;
		is_staff: boolean;
		is_superuser: boolean;
		is_active: boolean;
	};
}

interface TokenDecoded extends TokenDecodedUser {
	token_type: 'refresh' | 'access';
	exp: number;
	iat: number;
	jti: string;
}
