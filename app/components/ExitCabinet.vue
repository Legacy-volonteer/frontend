<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500/70"
    aria-label="Выйти из кабинета"
    @click="logout"
  >
    <span class="hidden sm:inline">Выйти</span>
    <Icon name="radix-icons:exit" size="22" class="-mr-1" />
  </button>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const companyAuth = useCompanyAuthStore();

function logout() {
  auth.logout();
  companyAuth.logout();
  navigateTo("/");
}
</script>
