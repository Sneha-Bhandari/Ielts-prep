export interface AdminFormValues {
    name: string;
    email: string;
    phone: string;
    country: string;
    companyId: string; 
    password: string;
    confirmPassword: string;
    role: 'admin' | 'super_admin';
  }
  
  export interface CreateAdminResponse {
    success: boolean;
    message: string;
    data: {
      id: string;
      name: string;
      email: string;
      phone: string;
      country: string;
      role: string;
      companyId?: string;
    };
  }
  
  export interface Company {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    subscriptionPlan: string;
    status: 'active' | 'inactive';
    createdAt: string;
  }