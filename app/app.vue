<script setup lang="ts">
const auth = useAuthStore();
const companyAuth = useCompanyAuthStore();

callOnce(() => {
  const restoredUserSession = auth.restoreSession();
  if (!restoredUserSession) {
    companyAuth.restoreSession();
  }
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
