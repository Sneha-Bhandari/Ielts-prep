import * as yup from "yup";

export const lessonSchema = yup.object().shape({
  section: yup.string().required("Section is required"),
  title: yup.string().required("Lesson title is required"),
});

export const courseSchema = yup.object().shape({
  title: yup.string().required("Course title is required"),
  type: yup.string().oneOf(["Academic", "GT", "UKVI"]).required(),
  isPublished: yup.boolean(),
  description: yup.string(),
  image: yup.string().url("Must be a valid URL"),
  lessons: yup.array().of(lessonSchema),
});