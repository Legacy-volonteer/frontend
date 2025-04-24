import { z } from "zod";

export const companySignUpFormSchema = z
  .object({
    email: z.string().email("Некорректный e-mail"),
    name: z
      .string()
      .min(2, "Длина должна быть не меньше 2 символов")
      .max(50, "Длина не может быть больше 50 символов"),
    password: z
      .string()
      .min(4, "Длина должна быть не меньше 4 символов")
      .max(50, "Длина не может быть больше 50 символов"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  });

export type CompanySignUpFormValues = z.infer<typeof companySignUpFormSchema>;
