import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email or username is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
