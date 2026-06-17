// src/interfaces/student.interface.ts
export interface Student {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    email: string;
    phone: string;
    avatar: string 
    country: string;
    targetBand: string;
    targetExam: string;
    currentLevel: string;
    enrollmentDate: string;
    isExternal: boolean;
    companyId: string;
  }
  
  export interface StudentFilters {
    search?: string;
    isExternal?: boolean;
  }
  
  export interface StudentStats {
    total: number;
    byExternal: {
      internal: number;
      external: number;
    };
  }