<template>
  <div>
    <TheNavbar />

    <div class="flex flex-col md:flex-row gap-6 px-4 md:px-8 my-6">
      <UContainer
        class="flex-1 bg-green-50/60 backdrop-blur-sm p-6 rounded-2xl ring-1 ring-green-100"
      >
        <UTabs v-model="currentTab" :items="tabs" justify="start" class="mb-4">
          <template #content="{ item }">
            <h2 class="text-lg font-semibold mb-4">
              {{
                item.value === "bonuses"
                  ? "Бонусы компании"
                  : item.value === "history"
                  ? "История использования бонусов"
                  : "Волонтёры компании"
              }}
            </h2>

            <UTable
              v-if="!isLoading"
              :key="item.value"
              :data="
                item.value === 'bonuses'
                  ? bonuses
                  : item.value === 'history'
                  ? history
                  : volunteers
              "
              :columns="
                item.value === 'bonuses'
                  ? columnsBonuses
                  : item.value === 'history'
                  ? columnsHistory
                  : columnsVolunteers
              "
              :ui="{
                thead: 'bg-green-500 text-sm font-medium',
                tbody: 'bg-white divide-y divide-green-100 text-sm',
                th: 'px-4 py-2 text-left whitespace-nowrap',
                td: 'px-4 py-3 whitespace-nowrap',
              }"
            />
            <div v-else class="text-center py-10">Загрузка данных…</div>
          </template>
        </UTabs>
      </UContainer>

      <UContainer class="w-full md:w-80 flex-shrink-0">
        <UCard
          class="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 sticky top-20"
          :ui="{ body: { padding: 'p-0' } }"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600"
          ></div>
          <div class="absolute inset-0 backdrop-blur-sm bg-white/10"></div>

          <div class="relative p-6 text-white text-center">
            <div
              class="w-16 h-16 mx-auto mb-3 grid place-content-center rounded-full bg-white/20 shadow-inner"
            >
              <span class="text-2xl font-extrabold tracking-wide">
                {{ companyInitials }}
              </span>
            </div>

            <template v-if="isLoadingCompany">
              <div class="animate-pulse space-y-2">
                <div class="h-4 bg-white/30 rounded"></div>
                <div class="h-3 bg-white/20 rounded w-5/6 mx-auto"></div>
              </div>
            </template>

            <template v-else-if="company">
              <h2 class="text-xl font-bold tracking-tight mb-2">
                {{ company.name }}
              </h2>

              <ul class="text-sm/relaxed space-y-1">
                <li class="flex items-center justify-center gap-1 opacity-90">
                  <Icon name="mdi:email-outline" size="18" />
                  <span>{{ company.email }}</span>
                </li>

                <li
                  v-if="company.phone"
                  class="flex items-center justify-center gap-1 opacity-90"
                >
                  <Icon name="mdi:phone" size="18" />
                  <span>{{ company.phone }}</span>
                </li>
              </ul>
              <ExitCabinet />
            </template>

            <template v-else>
              <p>Не удалось загрузить данные компании.</p>
            </template>
          </div>
        </UCard>
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Bonus } from "~/types/models/bonus";
import type { Volunteer } from "~/types/models/volunteer";

definePageMeta({ name: "Профиль компании", middleware: ["company-auth"] });

const companyAuth = useCompanyAuthStore();
const companyStore = useCompanyMeStore();

const isLoadingCompany = ref(true);
const currentTab = ref<"bonuses" | "history" | "volunteers">("bonuses");

const company = computed(() => companyStore.company);
const bonuses = computed<Bonus[]>(() => companyStore.companyBonuses ?? []);
const volunteers = computed<Volunteer[]>(
  () => companyStore.companyVolunteers ?? []
);

const history = computed(() =>
  companyStore.companyGivenBonuses.map((item) => ({
    volunteerName: item.volunteer?.full_name ?? "—",
    bonusName: item.name ?? "—",
    usedAt: new Date(item.claimed_at).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    level:
      item.level === "min"
        ? "минимальный"
        : item.level === "medium"
        ? "средний"
        : item.level === "max"
        ? "максимальный"
        : item.level,
  }))
);

const isLoading = computed(() => isLoadingCompany.value);

onMounted(async () => {
  try {
    await companyStore.getMe(companyAuth.token);
    await Promise.all([
      companyStore.getCompanyBonuses(companyAuth.token),
      companyStore.getGivenBonuses(companyAuth.token),
      companyStore.getVolunteers(companyAuth.token),
    ]);
  } finally {
    isLoadingCompany.value = false;
  }
});

const tabs = [
  { value: "bonuses", label: "Бонусы компании" },
  { value: "history", label: "История использования" },
  { value: "volunteers", label: "Волонтёры" },
] as const;

const columnsBonuses = [
  { accessorKey: "name", header: "Бонус" },
  { accessorKey: "level", header: "Уровень доступа" },
] as const;

const columnsHistory = [
  { accessorKey: "volunteerName", header: "Волонтёр" },
  { accessorKey: "bonusName", header: "Бонус" },
  { accessorKey: "usedAt", header: "Дата использования" },
  { accessorKey: "level", header: "Уровень доступа" },
] as const;

const columnsVolunteers = [
  { accessorKey: "full_name", header: "ФИО" },
  { accessorKey: "inn", header: "ИНН" },
  { accessorKey: "email", header: "E-mail" },
  { accessorKey: "access_level", header: "Уровень доступа" },
] as const;

const companyInitials = computed(() => {
  if (!company.value?.name) return "";
  return company.value.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});
</script>
