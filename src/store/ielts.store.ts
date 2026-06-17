import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  IeltsCourse,
} from "../interfaces/ielts.interface";

interface IELTSStore {
  courses: IeltsCourse[];

  addCourse: (course: IeltsCourse) => void;

  updateCourse: (
    id: string,
    course: Partial<IeltsCourse> 
  ) => void;

  deleteCourse: (
    id: string
  ) => void;

  clearCourses: () => void;
  
  // Add a method to set courses from API
  setCourses: (courses: IeltsCourse[]) => void;
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
                  ? {
                      ...course, // Keep existing course data
                      ...updatedCourse, // Apply updates
                      // Ensure nested objects are properly merged
                      thumbnail: updatedCourse.thumbnail 
                        ? {
                            ...course.thumbnail,
                            ...updatedCourse.thumbnail,
                          }
                        : course.thumbnail,
                      ieltsType: updatedCourse.ieltsType
                        ? {
                            ...course.ieltsType,
                            ...updatedCourse.ieltsType,
                          }
                        : course.ieltsType,
                    }
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
          
        setCourses: (courses) =>
          set({
            courses,
          }),
      }),
      {
        name: "ielts-storage",
      }
    )
  );