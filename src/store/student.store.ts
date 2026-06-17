import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Student, StudentFilters, StudentStats } from "../interfaces/student.interface";

interface StudentStore {
  students: Student[];
  filters: StudentFilters;
  selectedStudentId: string | null;
  isLoading: boolean;
  stats: StudentStats | null;
  
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Student) => void;
  deleteStudent: (id: string) => void;
  deleteMultipleStudents: (ids: string[]) => void;
  setFilters: (filters: StudentFilters) => void;
  setSelectedStudent: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setStats: (stats: StudentStats) => void;
  clearStudents: () => void;
  resetFilters: () => void;
  
  getFilteredStudents: () => Student[];
  getStudentById: (id: string) => Student | undefined;
  getStudentsByCompany: (companyId: string) => Student[];
  getStats: () => StudentStats;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: [],
      filters: {},
      selectedStudentId: null,
      isLoading: false,
      stats: null,

      setStudents: (students) =>
        set(() => ({
          students,
          stats: get().getStats(),
        })),

      addStudent: (student) =>
        set((state) => ({
          students: [...state.students, student],
          stats: get().getStats(),
        })),

      updateStudent: (id, updatedStudent) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? updatedStudent : s
          ),
          stats: get().getStats(),
        })),

      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
          stats: get().getStats(),
        })),

      deleteMultipleStudents: (ids) =>
        set((state) => ({
          students: state.students.filter((s) => !ids.includes(s.id)),
          stats: get().getStats(),
        })),

      setFilters: (filters) =>
        set({ filters }),

      resetFilters: () =>
        set({ filters: {} }),

      setSelectedStudent: (id) =>
        set({ selectedStudentId: id }),

      setLoading: (isLoading) =>
        set({ isLoading }),

      setStats: (stats) =>
        set({ stats }),

      clearStudents: () =>
        set({ students: [], stats: null }),

      getFilteredStudents: () => {
        const { students, filters } = get();
        
        if (!filters.search && filters.isExternal === undefined) {
          return students;
        }

        return students.filter((student) => {
          const matchesSearch = !filters.search ||
            student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            student.country.toLowerCase().includes(filters.search.toLowerCase());

          const matchesExternal = filters.isExternal === undefined || 
            student.isExternal === filters.isExternal;

          return matchesSearch && matchesExternal;
        });
      },

      getStudentById: (id) => {
        return get().students.find((s) => s.id === id);
      },

      getStudentsByCompany: (companyId) => {
        return get().students.filter((s) => s.companyId === companyId);
      },

      getStats: () => {
        const students = get().students;
        const byExternal = {
          internal: 0,
          external: 0,
        };
        
        students.forEach((student) => {
          if (student.isExternal) {
            byExternal.external += 1;
          } else {
            byExternal.internal += 1;
          }
        });
        
        return {
          total: students.length,
          byExternal,
        };
      },
    }),
    {
      name: "student-storage",
      partialize: (state) => ({
        students: state.students,
        filters: state.filters,
        selectedStudentId: state.selectedStudentId,
      }),
    }
  )
);