import type { ZodObject, ZodOptional } from 'zod';

export const SchemaValidation = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  schema: ZodObject<any, any, any> | ZodOptional<ZodObject<any, any, any>>
) => {
  const result = schema.safeParse(data);
  return result.success;
};
