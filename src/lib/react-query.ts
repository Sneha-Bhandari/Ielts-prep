import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query";
import axios from "axios";


const baseURL = import.meta.env.VITE_API_URL;


interface AppMutationProps {
  url: string;
  type: "post" | "patch" | "delete" | "put";
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useAppMutation = ({
  type,
  onSuccess,
  onError,
  url,
}: AppMutationProps) => {
  return useMutation({
    mutationFn: async ({ data, id }: { data?: any; id?: string }) => {
      const formattedUrl = id ? `${url}/${id}` : url;

      const response = await axios.request({
        baseURL,
        url: formattedUrl,
        method: type,
        data,
      });

      return response.data;
    },

    onSuccess: (data) => {
      if (onSuccess) onSuccess(data);
    },

    onError: (error) => {
      if (onError) onError(error);
    },
  });
};


interface AppQueryProps<T = any> {
  url: string;
  queryKey: string[];
  enabled?: boolean;
  options?: any;
}

export const useAppQuery = <T>({
  url,
  queryKey,
  enabled = true,
  options,
}: AppQueryProps<T>): UseQueryResult<T> => {
  return useQuery<T>({
    queryKey,
    enabled,
    queryFn: async () => {
      const response = await axios.get<T>(url, {
        baseURL,
      });

      return response.data;
    },
    ...options,
  });
};

