<template>
  <div>
    <nav class="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div
        class="mx-auto max-w-7xl flex items-center justify-between px-4 md:px-6 py-3"
      >
        <button
          class="flex items-center select-none group"
          aria-label="На главную"
          @click="navigateTo('/')"
        >
          <span
            class="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#2cad00] to-[#009c4a] bg-clip-text text-transparent transition-all duration-300 group-hover:from-[#249200] group-hover:to-[#007c37]"
          >
            Волонтёрка
          </span>
        </button>

        <button
          class="hidden sm:flex items-center bg-[#2cad00] hover:bg-[#249200] text-white font-semibold rounded-full px-5 py-2 transition-colors duration-200 shadow"
          aria-label="Личный кабинет"
          @click="navigateTo('/me')"
        >
          <Icon name="mdi:account" size="20" />
          <span class="ml-2">Личный кабинет</span>
        </button>

        <button
          aria-label="Toggle navigation"
          class="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2cad00]"
          @click="isOpen = !isOpen"
        >
          <Icon :name="isOpen ? 'mdi:close' : 'mdi:menu'" size="24" />
        </button>
      </div>

      <transition name="fade">
        <ul
          v-if="isOpen"
          class="lg:hidden px-4 pb-4 space-y-2 text-base font-medium"
        >
          <li>
            <button
              class="flex items-center bg-[#2cad00] hover:bg-[#249200] text-white font-semibold rounded-full px-4 py-2 w-max"
              @click="goToMe"
            >
              <Icon name="mdi:account" size="20" />
              <span class="ml-2">Личный кабинет</span>
            </button>
          </li>
          <ExitCabinet
            v-if="auth.isAuthenticated || companyAuth.isAuthenticated"
            class="block"
            @click="isOpen = false"
          />
        </ul>
      </transition>
    </nav>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const companyAuth = useCompanyAuthStore();

const isOpen = ref(false);

const goToMe = () => {
  navigateTo("/me");
  isOpen.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
