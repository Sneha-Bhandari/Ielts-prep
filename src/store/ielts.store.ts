import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  IeltsCourse,
} from "../interfaces/ielts.interface";

interface IELTSStore {
  courses: IeltsCourse[];

  addCourse: (course: IeltsCourse) => void;

  updateCourse: (
    id: number,
    course: IeltsCourse
  ) => void;

  deleteCourse: (
    id: number
  ) => void;

  clearCourses: () => void;
}

export const useIELTSStore =
  create<IELTSStore>()(
    persist(
      (set) => ({
        courses: [],

        addCourse: (course) =>
          set((state) => ({
            courses: [
              ...state.courses,
              course,
            ],
          })),

        updateCourse: (
          id,
          updatedCourse
        ) =>
          set((state) => ({
            courses: state.courses.map(
              (course) =>
                course.id === id
                  ? updatedCourse
                  : course
            ),
          })),

        deleteCourse: (id) =>
          set((state) => ({
            courses:
              state.courses.filter(
                (course) =>
                  course.id !== id
              ),
          })),

        clearCourses: () =>
          set({
            courses: [],
          }),
      }),
      {
        name: "ielts-storage",
      }
    )
  );