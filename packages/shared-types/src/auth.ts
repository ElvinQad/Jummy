import type { User } from "./types";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface CountryCode {
  value: string;
  label: string;
  id: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}