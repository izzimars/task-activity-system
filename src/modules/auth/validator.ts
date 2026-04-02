import { z } from "zod";

const email = z.string().trim().email();
const password = z.string().min(8).max(72);

export const registerSchema = z.object({
  email,
  password
});

export const loginSchema = z.object({
  email,
  password
});
