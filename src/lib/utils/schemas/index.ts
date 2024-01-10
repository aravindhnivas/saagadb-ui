import { z } from 'zod';

export const linelistSchema = z.object({
	linelist_name: z.string().min(1)
});
