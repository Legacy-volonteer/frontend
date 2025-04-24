<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { Label } from "reka-ui";
import { userSignUpFormSchema, type UserSignUpFormValues } from "@/types";

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push("/me");
    return;
  }
});

const { handleSubmit, meta, isSubmitting } = useForm<UserSignUpFormValues>({
  validationSchema: toTypedSchema(userSignUpFormSchema),
  initialValues: {
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  },
});

const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: username, errorMessage: usernameError } =
  useField<string>("username");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");
const { value: passwordConfirm, errorMessage: passwordConfirmError } =
  useField<string>("passwordConfirm");

const isSubmitDisabled = computed(
  () => !meta.value.valid || isSubmitting.value
);

const errorMessage = ref<string | null>(null);

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null;

  try {
    await authStore.register({
      email: values.email,
      username: values.username,
      password: values.password,
      passwordConfirm: values.passwordConfirm,
    });

    router.push("/me");
  } catch (err) {}
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow">
      <CancelCross href="/" class="mb-4" />

      <h1 class="mb-6 text-2xl font-semibold text-center text-gray-800">
        Регистрация в приложении
      </h1>

      <form @submit.prevent="onSubmit" class="space-y-6" novalidate>
        <div>
          <Label
            for="email"
            class="block mb-1 text-sm font-medium text-gray-700"
          >
            Электронная почта
          </Label>
          <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Ваша электронная почта"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-600">
            {{ emailError }}
          </p>
        </div>

        <div>
          <Label
            for="username"
            class="block mb-1 text-sm font-medium text-gray-700"
          >
            Имя пользователя
          </Label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Ваш логин"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
          />
          <p v-if="usernameError" class="mt-1 text-sm text-red-600">
            {{ usernameError }}
          </p>
        </div>

        <div>
          <Label
            for="password"
            class="block mb-1 text-sm font-medium text-gray-700"
          >
            Пароль
          </Label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Пароль"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
          />
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">
            {{ passwordError }}
          </p>
        </div>

        <div>
          <Label
            for="passwordConfirm"
            class="block mb-1 text-sm font-medium text-gray-700"
          >
            Повторите пароль
          </Label>
          <input
            id="passwordConfirm"
            v-model="passwordConfirm"
            type="password"
            placeholder="Повторите пароль"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
          />
          <p v-if="passwordConfirmError" class="mt-1 text-sm text-red-600">
            {{ passwordConfirmError }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitDisabled"
          class="mt-8 block w-full px-4 py-2 font-medium text-white bg-[#2cad00] rounded-md hover:bg-[#249200] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting">Регистрация...</span>
          <span v-else>Создать аккаунт</span>
        </button>

        <p v-if="errorMessage" class="mt-2 text-sm text-center text-red-600">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>
