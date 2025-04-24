import { defineStore } from "pinia";
import type { Company } from "~/types/models/company";
import type { Bonus } from "~/types/models/bonus";
import type { UsedBonus } from "~/types/responses";
import type { Volunteer } from "~/types/models/volunteer";

export const useCompanyMeStore = defineStore("meCompany", () => {
  const _company = ref<Company | null>(null);
  const _companyBonuses = ref<Bonus[]>([]);
  const _companyGivenBonuses = ref<UsedBonus[]>([]);
  const _companyVolunteers = ref<Volunteer[]>([]);

  const company = computed(() => _company.value);
  const companyBonuses = computed(() => _companyBonuses.value);
  const companyGivenBonuses = computed(() => _companyGivenBonuses.value);
  const companyVolunteers = computed(() => _companyVolunteers.value);

  const getMe = async (token: string | null) => {
    const cfg = useRuntimeConfig();
    _company.value = await $fetch<Company>(`${cfg.public.apiUrl}/company/me`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
  };

  const getCompanyBonuses = async (token: string | null) => {
    const cfg = useRuntimeConfig();
    const { bonuses } = await $fetch<{ bonuses: Bonus[] }>(
      `${cfg.public.apiUrl}/company/bonuses`,
      { headers: { Authorization: token ? `Bearer ${token}` : "" } }
    );

    bonuses.forEach((bonus) => {
      if (bonus.level === "min") {
        bonus.level = "минимальный";
      } else if (bonus.level === "medium") {
        bonus.level = "средний";
      } else {
        bonus.level = "максимальный";
      }
    });
    _companyBonuses.value = bonuses;
  };

  const getGivenBonuses = async (token: string | null) => {
    const cfg = useRuntimeConfig();

    const { bonuses } = await $fetch<{ bonuses: UsedBonus[] }>(
      `${cfg.public.apiUrl}/company/bonuses/history`,
      { headers: { Authorization: token ? `Bearer ${token}` : "" } }
    );

    _companyGivenBonuses.value = bonuses;
  };

  const getVolunteers = async (token: string | null) => {
    const cfg = useRuntimeConfig();
    const { volunteers } = await $fetch<{ volunteers: Volunteer[] }>(
      `${cfg.public.apiUrl}/company/volunteers`,
      { headers: { Authorization: token ? `Bearer ${token}` : "" } }
    );
    _companyVolunteers.value = volunteers;
  };

  return {
    company,
    companyBonuses,
    companyGivenBonuses,
    companyVolunteers,
    getMe,
    getCompanyBonuses,
    getGivenBonuses,
    getVolunteers,
  };
});
