// src/interfaces/teacher.interface.ts
export interface Teacher {
    id: string;
    name: string;
    email: string;
    phone: string;
    profile: Profile | null;
    country: string;
    role?: 'teacher' | 'counselor' | string;
    enrollmentDate: string;
    proofDocument: string;
  }
  
  export interface Profile {
    id: string;
    url: string;
    key?: string;
    mimeType?: string;
    size?: number;
    type?: string;
  }
  
  export interface TeacherFilters {
    search?: string;
    role?: 'teacher' | 'counselor';
    country?: string;
    enrollmentDateFrom?: string;
    enrollmentDateTo?: string;
  }
  
  export interface TeacherStats {
    total: number;
    byRole: {
      teacher: number;
      counselor: number;
      unspecified: number;
    };
    byCountry: Record<string, number>;
    mostRecentEnrollment: string | null;
    oldestEnrollment: string | null;
  }