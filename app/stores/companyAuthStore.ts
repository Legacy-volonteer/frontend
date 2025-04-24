// stores/companyAuthStore.ts
import { defineStore } from "pinia";
import type { CompanyResponse } from "~/types/responses";
import type { CompanySignInFormValues, CompanySignUpFormValues } from "@/types";

export const useCompanyAuthStore = defineStore("companyAuth", () => {
  const toast = useToast();

  const _token = ref<string | null>(null);

  const token = computed(() => _token.value);

  const isAuthenticated = computed(() => Boolean(_token.value));

  function setToken(newToken: string | null) {
    _token.value = newToken;
    if (import.meta.client) {
      newToken
        ? localStorage.setItem("companyToken", newToken)
        : localStorage.removeItem("companyToken");
    }
  }

  async function login({ email, password }: CompanySignInFormValues) {
    const {
      public: { apiUrl },
    } = useRuntimeConfig();

    const { access_token } = await $fetch<CompanyResponse>(
      `${apiUrl}/company/login`,
      {
        method: "POST",
        body: { email, password },
      }
    );

    setToken(access_token);
  }

  async function register({ email, name, password }: CompanySignUpFormValues) {
    const {
      public: { apiUrl },
    } = useRuntimeConfig();

    const { access_token } = await $fetch<CompanyResponse>(
      `${apiUrl}/company/register`,
      {
        method: "POST",
        body: { name, email, password },
      }
    );

    setToken(access_token);
  }

  function restoreSession() {
    localStorage.removeItem("companyToken");
    if (import.meta.client) {
      const saved = localStorage.getItem("companyToken");
      if (saved) _token.value = saved;
    }
  }

  async function logout() {
    try {
      const {
        public: { apiUrl },
      } = useRuntimeConfig();
      await $fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value ?? ""}` },
      });
    } finally {
      setToken(null);
    }
  }

  return { token, isAuthenticated, login, register, logout, restoreSession };
});
