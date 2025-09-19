export interface User {
  id: string;
  cpf: string;
  full_name: string;
  email: string;
  phone: string;
  profile_image?: string;
  biometric_enabled: boolean;
  created_at: string;
}

export interface LoginCredentials {
  cpf: string;
  password: string;
}

export interface RegisterData {
  cpf: string;
  password: string;
  full_name: string;
  email: string;
  phone: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}