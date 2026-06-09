import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../api/loginapi";
import type { OtpValues, AuthResponse } from "../interfaces/login";

export const useVerifyOtp = () =>
  useMutation<AuthResponse, Error, OtpValues>({
    mutationFn: verifyOtp,
  });