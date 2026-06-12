import { useMutation, useQuery } from "@tanstack/react-query";
import { createAdmin, getCompanies } from "../api/adminApi";
import type { AdminFormValues, CreateAdminResponse, Company } from "../interfaces/admin";

export const useCreateAdmin = () => {
  return useMutation<CreateAdminResponse, Error, AdminFormValues>({
    mutationFn: createAdmin,
  });
};

export const useGetCompanies = () => {
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: getCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};