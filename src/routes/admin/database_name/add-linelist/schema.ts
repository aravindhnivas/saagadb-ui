import { z } from 'zod';

export default z.object({
	linelist_name: z.string().min(1)
});