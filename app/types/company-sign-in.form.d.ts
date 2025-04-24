import { z } from "zod";

export const companySignInFormSchema = z.object({
  email: z.string().email("Некорректный e-mail"),
  password: z.string().min(4, "Пароль обязателен"),
});

export type CompanySignInFormValues = z.infer<typeof companySignInFormSchema>;
