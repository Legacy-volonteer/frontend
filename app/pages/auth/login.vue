<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  userSignInFormSchema,
  companySignInFormSchema,
  type UserSignInFormValues,
  type CompanySignInFormValues,
} from "@/types";
import { Label } from "reka-ui";

const authStore = useAuthStore();
const companyAuthStore = useCompanyAuthStore();

type Tab = "user" | "company";
const active = ref<Tab>("user");

const {
  handleSubmit: handleUserSubmit,
  meta: userMeta,
  isSubmitting: userSubmitting,
} = useForm<UserSignInFormValues>({
  validationSchema: toTypedSchema(userSignInFormSchema),
  initialValues: { email: "", password: "" },
});

const { value: userEmail, errorMessage: userEmailErr } =
  useField<string>("email");
const { value: userPass, errorMessage: userPassErr } =
  useField<string>("password");

const userDisabled = computed(
  () => !userMeta.value.valid || userSubmitting.value
);

const {
  handleSubmit: handleCompSubmit,
  meta: compMeta,
  isSubmitting: compSubmitting,
} = useForm<CompanySignInFormValues>({
  validationSchema: toTypedSchema(companySignInFormSchema),
  initialValues: { email: "", password: "" },
});

const { value: compEmail, errorMessage: compEmailErr } =
  useField<string>("email");
const { value: compPass, errorMessage: compPassErr } =
  useField<string>("password");

const compDisabled = computed(
  () => !compMeta.value.valid || compSubmitting.value
);

const onUserSubmit = handleUserSubmit(async (values) => {
  try {
    await authStore.login(values);
    await navigateTo("/me", { replace: true });
  } catch (err) {
    console.error("user login failed:", err);
  }
});

const onCompSubmit = handleCompSubmit(async (values) => {
  try {
    await companyAuthStore.login(values);
    await navigateTo("/company", { replace: true });
  } catch (err) {
    console.error("company login failed:", err);
  }
});

watch(
  () => [authStore.isAuthenticated, companyAuthStore.isAuthenticated],
  ([isUser, isCompany]) => {
    if (isUser) navigateTo("/me", { replace: true });
    else if (isCompany) navigateTo("/company", { replace: true });
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50">
    <div class="relative w-full max-w-md rounded-lg shadow">
      <div class="absolute -top-10 left-0 flex w-full">
        <button
          class="w-1/2 rounded-t-lg px-4 py-2 text-center text-sm font-medium transition-colors"
          :class="
            active === 'user'
              ? 'bg-white text-gray-900 shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border-b border-gray-300'
          "
          @click="active = 'user'"
        >
          Волонтёр
        </button>
        <button
          class="w-1/2 rounded-t-lg px-4 py-2 text-center text-sm font-medium transition-colors"
          :class="
            active === 'company'
              ? 'bg-white text-gray-900 shadow-md'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border-b border-gray-300'
          "
          @click="active = 'company'"
        >
          Компания-партнёр
        </button>
      </div>

      <div class="rounded-lg bg-white p-8 pt-14 shadow">
        <CancelCross href="/" class="mb-4" />

        <h1 class="mb-6 text-center text-2xl font-semibold text-gray-800">
          {{
            active === "user"
              ? "Вход в приложение для волонтёров"
              : "Вход в приложение для компаний"
          }}
        </h1>

        <form
          v-if="active === 'user'"
          class="space-y-6"
          novalidate
          @submit.prevent="onUserSubmit"
        >
          <div>
            <Label
              for="uEmail"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Электронная почта
            </Label>
            <input
              id="uEmail"
              v-model="userEmail"
              type="email"
              autocomplete="username"
              placeholder="user@mail.com"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
            />
            <p v-if="userEmailErr" class="mt-1 text-sm text-red-600">
              {{ userEmailErr }}
            </p>
          </div>

          <div>
            <Label
              for="uPass"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Пароль
            </Label>
            <input
              id="uPass"
              v-model="userPass"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
            />
            <p v-if="userPassErr" class="mt-1 text-sm text-red-600">
              {{ userPassErr }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="userDisabled"
            class="mt-8 w-full rounded-md bg-[#2cad00] px-4 py-2 font-medium text-white hover:bg-[#249200] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="userSubmitting">Вход…</span>
            <span v-else>Войти</span>
          </button>

          <p class="mt-4 text-center">
            <NuxtLink
              to="/auth/register"
              class="font-bold text-[#2cad00] hover:underline"
            >
              У меня нет аккаунта
            </NuxtLink>
          </p>
        </form>

        <form
          v-else
          class="space-y-6"
          novalidate
          @submit.prevent="onCompSubmit"
        >
          <div>
            <Label
              for="cEmail"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Корпоративная почта
            </Label>
            <input
              id="cEmail"
              v-model="compEmail"
              type="email"
              autocomplete="username"
              placeholder="email@company.com"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
            />
            <p v-if="compEmailErr" class="mt-1 text-sm text-red-600">
              {{ compEmailErr }}
            </p>
          </div>

          <div>
            <Label
              for="cPass"
              class="mb-1 block text-sm font-medium text-gray-700"
            >
              Пароль
            </Label>
            <input
              id="cPass"
              v-model="compPass"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
            />
            <p v-if="compPassErr" class="mt-1 text-sm text-red-600">
              {{ compPassErr }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="compDisabled"
            class="mt-8 w-full rounded-md bg-[#2cad00] px-4 py-2 font-medium text-white hover:bg-[#249200] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="compSubmitting">Вход…</span>
            <span v-else>Войти</span>
          </button>
          <p class="mt-4 text-center">
            <NuxtLink
              to="/auth/company/register"
              class="font-bold text-[#2cad00] hover:underline"
            >
              У нас отсутствует аккаунт
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
