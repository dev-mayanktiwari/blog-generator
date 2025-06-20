import { z } from "zod";

export const UserLoginInput = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50).optional(),
  registerType: z.enum(["EMAIL", "GOOGLE"]),
});

export type TUserLoginInput = z.infer<typeof UserLoginInput>;
