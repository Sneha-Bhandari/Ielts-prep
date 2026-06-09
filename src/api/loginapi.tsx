import api from "../api/api";
import type { LoginValues, AuthResponse, OtpValues } from "../interfaces/login";

export const loginUser = async (
  data: LoginValues
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};
export const verifyOtp = async (
  data: OtpValues
  
): Promise<AuthResponse> => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};