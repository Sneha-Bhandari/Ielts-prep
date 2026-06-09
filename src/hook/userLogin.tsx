import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/loginapi";
import type { LoginValues, AuthResponse } from "../interfaces/login";

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginValues>({
    mutationFn: loginUser,
  });
};