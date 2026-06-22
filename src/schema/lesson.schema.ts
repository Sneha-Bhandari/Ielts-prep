import * as yup from "yup";

export const lessonSchema = yup.object().shape({
  
  
  title: yup.string()
    .required("Lesson title is required")
    .max(300, "Lesson title must be less than 300 characters"),
  
  content: yup.string()
    .required("Lesson content is required")
    .max(50000, "Content is too long"),

  
  duration: yup.number()
    .integer("Duration must be an integer")
    .min(1, "Duration must be at least 1 second")
    .max(86400, "Duration cannot exceed 24 hours")
    .required("Duration is required"),
  
  order: yup.number()
    .integer("Order number must be an integer")
    .min(0, "Order number cannot be negative")
    .required("Order number is required"),
});

export type LessonFormData = yup.InferType<typeof lessonSchema>;