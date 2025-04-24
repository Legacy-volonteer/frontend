export interface UserDto {
  id: number;
  username: string;
  email: string;
  confirmation_code: string;
}

export interface UserResponse {
  user: UserDto;
  access_token: string;
  token_type: string;
}
