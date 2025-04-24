export interface CompanyDto {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyResponse {
  company: CompanyDto;
  access_token: string;
  token_type: string;
}
