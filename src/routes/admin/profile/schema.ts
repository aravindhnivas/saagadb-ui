import { z } from 'zod';

export default z.object({
	current_password: z.string().min(8),
	new_password: z.string().min(8)
});
