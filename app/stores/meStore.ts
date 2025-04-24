import { defineStore } from "pinia";
import type { User } from "~/types/models/user";

export const useMeStore = defineStore("me", () => {
  const _user = ref<User | null>(null);
  const user = computed(() => _user.value);

  const getMe = async (token: string | null) => {
    const config = useRuntimeConfig();

    const response = await $fetch<User>(`${config.public.apiUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const responseUser = {
      id: response.id,
      username: response.username,
      email: response.email,
      confirmation_code: response.confirmation_code,
    };
    _user.value = responseUser;
  };

  return {
    getMe,
    user,
  };
});
