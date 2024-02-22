import { z } from 'zod';

export const PasswordSchema = z.object({
	password: z.string().min(8),
	confirm_password: z.string().min(8)
}).refine(data => data.password === data.confirm_password, {
	message: 'Passwords do not match',
	path: ['confirm_password']
});
