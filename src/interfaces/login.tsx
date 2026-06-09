export interface LoginValues {
  email: string;
  password: string;
}

export interface OtpValues {
  email: string;
  otp: string;
}


export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
    requiresOtp: boolean;
}