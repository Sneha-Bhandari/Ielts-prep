// src/interfaces/student.interface.ts
export interface Student {
    id: string;
    createdAt?: string;
    updatedAt?: string;
    name: string;
    email: string;
    phone: string;
    avatar: Avatar | null;
    country: string;
    targetBand: string;
    targetExam: {
        id: string;
        title: string;
        ieltsType?: {
            id: string;
            name: string;
        };
    } | null;
    currentLevel: string;
    enrollmentDate: string;
    isExternal: boolean;
    companyId: string | null;
  }
  export interface Avatar {
    id: string;
    url: string;
    key?: string;
    mimeType?: string;
    size?: number;
    type?: string;
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