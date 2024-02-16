import { z } from 'zod';

export default z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
	organization: z.string().min(2).default('saagadb'),
	approver: z
		.union([z.string().min(1), z.number().int().min(1)])
		.array()
		.default([]),
	is_staff: z.boolean().default(false)
});
