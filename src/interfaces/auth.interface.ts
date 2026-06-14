export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'counsellor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface OtpValues {
  email: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  requiresOtp: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isVerified: boolean;
  setAuth: (user: User, token: string) => void;
  setVerified: (value: boolean) => void;
  logout: () => void;
}