import { z } from 'zod';

export default z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
	organization: z.string().min(2).default('saagadb'),
	approver: z.string().min(1),
	is_staff: z.boolean().default(false)
});
