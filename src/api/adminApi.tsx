import axios from 'axios';
import type { AdminFormValues, CreateAdminResponse, Company } from '../interfaces/admin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createAdmin = async (data: AdminFormValues): Promise<CreateAdminResponse> => {
  const { confirmPassword, ...adminData } = data;
  
  const response = await api.post('/super-admin/admins', adminData);
  return response.data;
};
export const getCompanies = async (): Promise<Company[]> => {
  const response = await api.get('/super-admin/companies');
  return response.data;
};

export const inviteAdmin = async (email: string, role: string, companyId?: string): Promise<void> => {
  await api.post('/super-admin/invite', { email, role, companyId });
};