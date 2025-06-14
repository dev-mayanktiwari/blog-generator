import { z } from "zod";

export const UserRegistrationInput = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
});

export type TUserRegistrationInput = z.infer<typeof UserRegistrationInput>;
