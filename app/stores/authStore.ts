import { defineStore } from "pinia";
import type { FetchError } from "ofetch";
import type { UserSignInFormValues, UserSignUpFormValues } from "@/types";
import type { UserResponse } from "@/types/responses";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();
  const _token = ref<string | null>(null);
  const token = computed(() => _token.value);
  const isAuthenticated = ref(false);

  const login = async ({ email, password }: UserSignInFormValues) => {
    const config = useRuntimeConfig();

    try {
      const response = await $fetch<UserResponse>(
        `${config.public.apiUrl}/login`,
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      _token.value = response.access_token;
      isAuthenticated.value = true;
      localStorage.setItem("token", response.access_token);
    } catch (err: unknown) {
      const fetchErr = err as FetchError;

      switch (fetchErr.statusCode) {
        case 401:
          toast.add({
            title: "Ошибка входа",
            description: "Пользователя с такой почтой не существует.",
            color: "error",
            duration: 3000,
          });
          break;
        default:
          toast.add({
            title: "Ошибка входа",
            description: "Внутренняя ошибка сервера.",
            color: "error",
            duration: 3000,
          });
          break;
      }
    }
  };

  const register = async ({
    email,
    username,
    password,
    passwordConfirm,
  }: UserSignUpFormValues) => {
    const config = useRuntimeConfig();

    try {
      const response = await $fetch<UserResponse>(
        `${config.public.apiUrl}/register`,
        {
          method: "POST",
          body: {
            username,
            email,
            password,
            password_confirmation: passwordConfirm,
          },
        }
      );
      _token.value = response.access_token;
      if (import.meta.client) {
        localStorage.setItem("token", response.access_token);
      }
    } catch (err: unknown) {
      const fetchErr = err as FetchError;

      switch (fetchErr.statusCode) {
        case 401:
          toast.add({
            title: "Ошибка регистрации",
            description: "Длина пароля должна составлять не менее 4 символов.",
            color: "error",
            duration: 3000,
          });
          break;
        case 422:
          toast.add({
            title: "Ошибка регистрации",
            description:
              "Пользователь с таким никнеймом и электронной почтой уже существует.",
            color: "error",
            duration: 3000,
          });
          break;
        default:
          toast.add({
            title: "Ошибка регистрации",
            description: "Внутренняя ошибка сервера.",
            color: "error",
            duration: 3000,
          });
          break;
      }
    }
  };

  const restoreSession = () => {
    if (!isAuthenticated.value) {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        _token.value = savedToken;
        isAuthenticated.value = true;
        return true;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      const config = useRuntimeConfig();
      await $fetch(`${config.public.apiUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: token.value ? `Bearer ${token.value}` : "",
        },
      });
    } finally {
      _token.value = null;
      isAuthenticated.value = false;
      localStorage.removeItem("token");
    }
  };

  return {
    token,
    isAuthenticated,
    login,
    logout,
    register,
    restoreSession,
  };
});
