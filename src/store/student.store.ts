import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Student,
  StudentFilters,
  StudentStats,
} from "../interfaces/student.interface";

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

      // ✅ FIXED
      setStudents: (students) =>
        set({
          students: Array.isArray(students) ? students : [],
        }),

      addStudent: (student) =>
        set((state) => ({
          students: [...state.students, student],
        })),

      // ❌ removed stats recalculation
      updateStudent: (id, updatedStudent) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.id === id ? updatedStudent : s
          ),
        })),

      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      deleteMultipleStudents: (ids) =>
        set((state) => ({
          students: state.students.filter((s) => !ids.includes(s.id)),
        })),

      setFilters: (filters) => set({ filters }),

      resetFilters: () => set({ filters: {} }),

      setSelectedStudent: (id) => set({ selectedStudentId: id }),

      setLoading: (isLoading) => set({ isLoading }),

      setStats: (stats) => set({ stats }),

      clearStudents: () =>
        set({ students: [], stats: null }),

      getFilteredStudents: () => {
        const { students, filters } = get();

        if (!filters.search && filters.isExternal === undefined) {
          return students;
        }

        return students.filter((student) => {
          const search = filters.search?.toLowerCase() || "";

          const matchesSearch =
            !filters.search ||
            student.name.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search) ||
            student.country.toLowerCase().includes(search);

          const matchesExternal =
            filters.isExternal === undefined ||
            student.isExternal === filters.isExternal;

          return matchesSearch && matchesExternal;
        });
      },

      getStudentById: (id) =>
        get().students.find((s) => s.id === id),

      // ✅ SAFE + ALWAYS VALID ARRAY
      getStats: () => {
        const students = Array.isArray(get().students)
          ? get().students
          : [];

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