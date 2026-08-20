import { z } from "zod";

export const createPetSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  sex: z.string().optional(),
  birthDate: z.string().optional(),
  weight: z.number().positive().optional(),
  photoUrl: z.string().url().optional(),
  description: z.string().optional(),
});

export const updatePetSchema = createPetSchema.partial();