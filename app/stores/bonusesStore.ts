import { defineStore } from "pinia";

interface BonusResponse {
  id: number;
  name: string;
  level: string;
  company: { id: number; name: string };
  is_active: boolean;
}

export interface Bonus {
  id: number;
  name: string;
  level: string;
  company: string;
  activated: boolean;
}

export const useBonusesStore = defineStore("bonuses", () => {
  const toast = useToast();

  const bonuses = ref<Bonus[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const normalise = (raw: BonusResponse): Bonus => ({
    id: raw.id,
    name: raw.name,
    level: raw.level,
    company: raw.company?.name ?? "",
    activated: raw.is_active,
  });

  async function getBonuses() {
    const {
      public: { apiUrl },
    } = useRuntimeConfig();
    const auth = useAuthStore();

    isLoading.value = true;
    error.value = null;

    try {
      const res = await $fetch<{ bonuses: BonusResponse[] }>(
        `${apiUrl}/user/bonuses`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      bonuses.value = res.bonuses.map(normalise);
    } catch (e) {
      error.value = "Не удалось получить список бонусов";
      toast.add({ title: error.value, color: "error" });
    } finally {
      isLoading.value = false;
    }
  }

  async function activateBonus(id: number) {
    const {
      public: { apiUrl },
    } = useRuntimeConfig();
    const auth = useAuthStore();

    try {
      await $fetch(`${apiUrl}/user/bonuses/${id}/activate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      const b = bonuses.value.find((b) => b.id === id);
      if (b) b.activated = true;

      toast.add({
        title: "Бонус активирован",
        color: "success",
        duration: 2500,
      });
    } catch (e) {
      toast.add({
        title: "Ошибка активации",
        color: "error",
        duration: 3000,
      });
    }
  }

  return { bonuses, isLoading, error, getBonuses, activateBonus };
});
