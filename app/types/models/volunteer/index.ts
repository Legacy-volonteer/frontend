export interface Volunteer {
  id: number;
  full_name: string;
  inn: string;
  email: string;
  access_level: string;
}

export interface VolunteerForCompany {
  confirmation_code: string;
}
