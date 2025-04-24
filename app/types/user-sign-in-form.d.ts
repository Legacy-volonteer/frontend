import { z } from "zod";

export const userSignInFormSchema = z.object({
  email: z.string().email("Некорректный e-mail"),
  password: z.string().min(4, "Пароль обязателен"),
});

export type UserSignInFormValues = z.infer<typeof userSignInFormSchema>;
