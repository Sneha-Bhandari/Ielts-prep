// // hook/useCreateAdmin.ts
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { createAdmin, getCompanies } from "../api/adminApi";
// import type { CreateAdminResponse, AdminFormValues } from "../interfaces/admin";

// export const useCreateAdmin = () => {
//   return useMutation<CreateAdminResponse, Error, FormData>({
//     mutationFn: createAdmin,
//   });
// };

// export const useGetCompanies = () => {
//   return useQuery<AdminFormValues[]>({
//     queryKey: ['companies'],
//     queryFn: getCompanies,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });
// };