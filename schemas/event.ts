import z from 'zod';

export const CreateExitEntrySchema = z.object({
  personId: z.string(),
  gate: z.string()
});
