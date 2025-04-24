<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900">
    <header class="bg-gradient-to-r from-green-800 to-green-300 text-white">
      <div
        class="container mx-auto px-6 py-6 flex justify-between items-center"
      >
        <NuxtLink to="/" class="text-2xl font-extrabold tracking-wide"
          >Волонтёрка</NuxtLink
        >
        <nav class="space-x-6 hidden md:flex">
          <NuxtLink to="#features" class="hover:underline"
            >Возможности</NuxtLink
          >
          <NuxtLink to="#partners" class="hover:underline">Партнёры</NuxtLink>
        </nav>
      </div>
    </header>

    <section
      class="container mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center flex-grow"
    >
      <div>
        <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Получайте <span class="text-gray-600">награды</span> за альтруизм.
        </h1>
        <p class="text-lg text-gray-600 mb-8 max-w-xl">
          Волонтёрка даёт доступ к управлению вашими бонусами от компаний
          партнёров. Получайте бонусы за каждое благое действие и получайте
          эксклюзивные бонусы.
        </p>
        <div class="space-x-4">
          <UButton size="lg" color="primary" to="/auth/login"
            >Присоединиться как волонтёр</UButton
          >
          <UButton size="lg" variant="ghost" color="primary" to="/auth/login"
            >Стать компанией-партнёром</UButton
          >
        </div>
      </div>
    </section>

    <section id="features" class="bg-gray-50 py-24">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-16">Как это работает</h2>
        <div class="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon="mdi:hand-heart"
            title="Получайте сердечки за добро"
            description="Помогайте нуждающимся и получайте бонусы-сердечки в подарок."
          />
          <FeatureCard
            icon="mdi:gift"
            title="Получайте подарки"
            description="Обменивайте бонусы-сердечки на подарки от компаний партнёров, под чьим патронажом вы состоите."
          />
          <FeatureCard
            icon="mdi:handshake"
            title="Присоединяйтесь к нашему делу"
            description="Регистрируйтесь как компания и участвуйте в распределении бонусов для волонтёров."
          />
        </div>
      </div>
    </section>

    <section id="partners" class="py-24">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center mb-16">
          Создано при поддержки компании мойбизнес.рф
        </h2>
        <PartnerCarousel />
      </div>
    </section>

    <section class="bg-green-600 text-white py-24">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-4xl font-bold mb-6">Готовы помогать нуждающимся?</h2>
        <UButton size="lg" color="white" variant="outline" to="/auth/login"
          >Создайте бесплатный аккаунт</UButton
        >
      </div>
    </section>

    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="container mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <NuxtLink to="/" class="text-xl font-semibold text-white"
            >Волонтёрка</NuxtLink
          >
          <p class="mt-4">
            © {{ new Date().getFullYear() }} Волонтёрка. Все права защищены.
          </p>
        </div>
        <div>
          <h3 class="text-white font-medium mb-4">Навигация</h3>
          <ul class="space-y-2">
            <li><NuxtLink to="#features">Возможности</NuxtLink></li>
            <li><NuxtLink to="#partners">Партнёры</NuxtLink></li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
