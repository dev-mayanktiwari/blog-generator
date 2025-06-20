import { z } from "zod";

export const UserRegistrationInput = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(50).optional(),
  registerType: z.enum(["EMAIL", "GOOGLE"]),
  googleId: z.string().optional(),
});

export type TUserRegistrationInput = z.infer<typeof UserRegistrationInput>;
