// src/store/teacher.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Teacher,
  TeacherFilters,
  TeacherStats,
} from "../interfaces/teacher.interface";

interface TeacherStore {
  teachers: Teacher[];
  filters: TeacherFilters;
  selectedTeacherId: string | null;
  isLoading: boolean;
  stats: TeacherStats | null;

  setTeachers: (teachers: Teacher[]) => void;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  deleteMultipleTeachers: (ids: string[]) => void;

  setFilters: (filters: TeacherFilters) => void;
  setSelectedTeacher: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setStats: (stats: TeacherStats) => void;

  clearTeachers: () => void;
  resetFilters: () => void;

  getFilteredTeachers: () => Teacher[];
  getTeacherById: (id: string) => Teacher | undefined;
  getStats: () => TeacherStats;
  getTeachersByRole: (role: 'teacher' | 'counselor') => Teacher[];
}

export const useTeacherStore = create<TeacherStore>()(
  persist(
    (set, get) => ({
      teachers: [],
      filters: {},
      selectedTeacherId: null,
      isLoading: false,
      stats: null,

      setTeachers: (teachers) =>
        set({
          teachers: Array.isArray(teachers) ? teachers : [],
        }),

      addTeacher: (teacher) =>
        set((state) => ({
          teachers: [...state.teachers, teacher],
        })),

      updateTeacher: (id, updatedTeacher) =>
        set((state) => ({
          teachers: state.teachers.map((t) =>
            t.id === id ? updatedTeacher : t
          ),
        })),

      deleteTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      deleteMultipleTeachers: (ids) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => !ids.includes(t.id)),
        })),

      setFilters: (filters) => set({ filters }),

      resetFilters: () => set({ filters: {} }),

      setSelectedTeacher: (id) => set({ selectedTeacherId: id }),

      setLoading: (isLoading) => set({ isLoading }),

      setStats: (stats) => set({ stats }),

      clearTeachers: () =>
        set({ teachers: [], stats: null }),

      getFilteredTeachers: () => {
        const { teachers, filters } = get();

        if (!filters.search && !filters.role) {
          return teachers;
        }

        return teachers.filter((teacher) => {
          const search = filters.search?.toLowerCase() || "";

          const matchesSearch =
            !filters.search ||
            teacher.name.toLowerCase().includes(search) ||
            teacher.email.toLowerCase().includes(search) ||
            teacher.country.toLowerCase().includes(search) ||
            (teacher.role && teacher.role.toLowerCase().includes(search));

          const matchesRole =
            !filters.role ||
            teacher.role === filters.role;

          return matchesSearch && matchesRole;
        });
      },

      getTeacherById: (id) =>
        get().teachers.find((t) => t.id === id),

      getTeachersByRole: (role) => {
        const teachers = Array.isArray(get().teachers) ? get().teachers : [];
        return teachers.filter((teacher) => teacher.role === role);
      },

      getStats: () => {
        const teachers = Array.isArray(get().teachers)
          ? get().teachers
          : [];

        const byRole = {
          teacher: 0,
          counselor: 0,
          unspecified: 0,
        };

        const byCountry: Record<string, number> = {};

        teachers.forEach((teacher) => {
          // Count by role
          if (teacher.role === 'teacher') {
            byRole.teacher += 1;
          } else if (teacher.role === 'counselor') {
            byRole.counselor += 1;
          } else {
            byRole.unspecified += 1;
          }

          // Count by country
          if (teacher.country) {
            byCountry[teacher.country] = (byCountry[teacher.country] || 0) + 1;
          }
        });

        // Get most recent enrollment date
        let mostRecentEnrollment: string | null = null;
        let oldestEnrollment: string | null = null;

        teachers.forEach((teacher) => {
          if (teacher.enrollmentDate) {
            if (!mostRecentEnrollment || teacher.enrollmentDate > mostRecentEnrollment) {
              mostRecentEnrollment = teacher.enrollmentDate;
            }
            if (!oldestEnrollment || teacher.enrollmentDate < oldestEnrollment) {
              oldestEnrollment = teacher.enrollmentDate;
            }
          }
        });

        return {
          total: teachers.length,
          byRole,
          byCountry,
          mostRecentEnrollment,
          oldestEnrollment,
        };
      },
    }),
    {
      name: "teacher-storage",
      partialize: (state) => ({
        teachers: state.teachers,
        filters: state.filters,
        selectedTeacherId: state.selectedTeacherId,
      }),
    }
  )
);