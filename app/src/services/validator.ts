import { z } from 'zod';

export class ValidatorService {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('Validation Error:', result.error);
      throw new Error('Data validation failed.');
    }
    return result.data;
  }
}
