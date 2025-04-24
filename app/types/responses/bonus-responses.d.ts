import type { Volunteer } from "../models/volunteer";

export type AccessLevel = "минимальный" | "средний" | "максимальный";

export interface BonusDto {
  id: number;
  name: string;
  level: string;
}

export interface BonusesResponse {
  bonuses: BonusItem[];
}

export interface BonusItem {
  id: number;
  bonus_id: number;
  volunteer_recipient_id: number;
  claimed_at: string;
  bonus: Bonus;
  company: Company;
  volunteerRecipient: VolunteerRecipient;
}

export interface Bonus {
  id: number;
  name: string;
  level: string;
  company_id: number;
  user_id: number | null;
  is_used: boolean;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface Company {
  id: number;
  name: string;
  email: string;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface UsedBonus {
  id: number;
  name: string;
  level: string;
  claimed_at: string;
  volunteer: Volunteer;
}

export interface Volunteer {
  id: number;
  full_name: string;
  inn: string;
  email: string;
  access_level: string;
}
