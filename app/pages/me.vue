<template>
  <div>
    <TheNavbar />

    <div class="flex flex-col md:flex-row gap-6 px-4 md:px-8 my-6">
      <UContainer
        class="flex-1 bg-green-50/60 backdrop-blur-sm p-6 rounded-2xl ring-1 ring-green-100"
      >
        <UTabs v-model="currentTab" :items="tabs" justify="start" class="mb-4">
          <template #content="{ item }">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3"
            >
              <h2 class="text-lg font-semibold text-green-800">
                {{
                  item.value === "inactive"
                    ? "Доступные бонусы"
                    : "Активированные бонусы"
                }}
              </h2>

              <UButton
                v-if="item.value === 'inactive'"
                color="primary"
                :disabled="!selectedBonus"
                @click="openActivation"
              >
                Активировать
              </UButton>
            </div>

            <UTable
              v-if="!bonusesStore.isLoading"
              :key="item.value"
              ref="tableRef"
              v-model:row-selection="rowSelection"
              :data="
                item.value === 'inactive' ? inactiveBonuses : activeBonuses
              "
              :columns="columns"
              :row-id="(row) => row.id"
              @select="onSelect"
              :ui="{
                thead:
                  'bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white text-sm font-medium',
                tbody: 'bg-white/90 divide-y divide-green-100 text-sm',
                th: 'px-4 py-2 text-left whitespace-nowrap',
                td: 'px-4 py-3 whitespace-nowrap',
              }"
            />

            <div v-else class="text-center py-10 text-green-700">
              Загрузка бонусов…
            </div>
            <div
              v-if="bonusesStore.error"
              class="text-center py-10 text-red-600"
            >
              {{ bonusesStore.error }}
            </div>
          </template>
        </UTabs>
      </UContainer>

      <UContainer class="w-full md:w-80 flex-shrink-0">
        <UCard
          class="bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg sticky top-20 backdrop-blur"
          :ui="{ body: { padding: 'p-0' } }"
        >
          <div class="p-4">
            <template v-if="isLoadingMe">
              <p>Загрузка…</p>
            </template>

            <template v-else-if="user">
              <div
                class="mx-auto mb-4 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold"
              >
                {{ user.username?.charAt(0)?.toUpperCase() }}
              </div>

              <h2 class="text-xl font-semibold mb-1">{{ user.username }}</h2>

              <p class="text-sm mb-1">
                <span class="font-medium">Эл. почта:</span> {{ user.email }}
              </p>
              <p class="text-sm">
                <span class="font-medium">Код подтверждения:</span>
                {{ user.confirmation_code }}
              </p>

              <ExitCabinet />
            </template>

            <template v-else>
              <p>Не удалось загрузить профиль.</p>
            </template>
          </div>
        </UCard>
      </UContainer>

      <UModal v-model="isModalOpen" prevent-close>
        <template #content>
          <UCard class="p-6">
            <h3 class="text-lg font-semibold mb-3 text-green-700">
              Подтвердите активацию
            </h3>

            <p class="mb-6">
              Активировать бонус
              <span class="font-medium">{{ bonusToConfirm?.name }}</span
              >?
            </p>

            <div class="text-right space-x-2">
              <UButton variant="ghost" @click="isModalOpen = false"
                >Отмена</UButton
              >
              <UButton color="primary" @click="confirmActivation"
                >Активировать</UButton
              >
            </div>
          </UCard>
        </template>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/models/user";
import type { Bonus } from "~/types/models/bonus";

definePageMeta({
  name: "Профиль волонтера",
  middleware: ["auth"],
});

const auth = useAuthStore();
const meStore = useMeStore();
const bonusesStore = useBonusesStore();

const user = ref<User | null>(null);
const isLoadingMe = ref(true);

const currentTab = ref<"inactive" | "active">("inactive");

// ---------- bonuses ----------
const bonuses = computed(() => bonusesStore.bonuses);
const inactiveBonuses = computed(() =>
  bonuses.value.filter((b) => !b.activated)
);
const activeBonuses = computed(() => bonuses.value.filter((b) => b.activated));

// table columns
const columns = [
  { accessorKey: "name", header: "Бонус" },
  { accessorKey: "company", header: "Компания" },
  { accessorKey: "level", header: "Уровень" },
] as const;

// external selection model for <UTable>
const rowSelection = ref<Record<string, boolean>>({});
const tableRef = ref<any>(null);

// reactive pointer to the bonus awaiting confirmation
const bonusToConfirm = ref<Bonus | null>(null);
const isModalOpen = ref(false);

/**
 * Helper: returns the single selected bonus on the "inactive" tab or null.
 */
const selectedBonus = computed<Bonus | null>(() => {
  if (currentTab.value !== "inactive") return null;

  // collect the keys of selected rows – they are the bonus IDs thanks to :row-id
  const ids = Object.entries(rowSelection.value)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => Number(id));

  if (ids.length !== 1) return null;
  return inactiveBonuses.value.find((b) => b.id === ids[0]) ?? null;
});

// reset selection whenever the user switches tab
watch(currentTab, () => {
  rowSelection.value = {};
});

// ---------- event handlers ----------
/**
 * Fired each time a row is clicked (thanks to @select on <UTable>).
 * - a first click only highlights the row (row gets selected)
 * - a second click on the *same* already‑selected row opens the confirm modal
 */
function onSelect(row: TableRow<Bonus>) {
  // allow selection only on the "inactive" tab
  if (currentTab.value !== "inactive") return;

  // was the row already selected *before* this click?
  const wasSelected = row.getIsSelected();

  // toggle selection state (this will mutate `rowSelection` for us)
  row.toggleSelected(!wasSelected);

  // if it was already selected → open confirmation modal
  if (wasSelected) {
    bonusToConfirm.value = row.original as Bonus;
    isModalOpen.value = true;
  }
}

/**
 * Open the confirmation modal via explicit button click.
 */
function openActivation() {
  isModalOpen.value = true;
  if (selectedBonus.value) {
    bonusToConfirm.value = selectedBonus.value;
  }
}

/**
 * Confirm button inside the modal → call API & refresh list.
 */
async function confirmActivation() {
  if (!bonusToConfirm.value) return;

  try {
    await bonusesStore.activateBonus(bonusToConfirm.value.id);
    // refetch list so that the row disappears from "inactive" and appears in "active"
    await bonusesStore.getBonuses();
  } finally {
    // cleanup UI state regardless of success/failure
    rowSelection.value = {};
    isModalOpen.value = false;
    bonusToConfirm.value = null;
  }
}

// ---------- bootstrapping ----------
onMounted(async () => {
  try {
    await meStore.getMe(auth.token);
    user.value = meStore.user;
    await bonusesStore.getBonuses();
  } finally {
    isLoadingMe.value = false;
  }
});

// tab items
const tabs = [
  { value: "inactive", label: "Доступные" },
  { value: "active", label: "Активированные" },
] as const;
</script>
