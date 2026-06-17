// src/schema/student.schema.ts
import * as yup from "yup";

export const studentSchema = yup.object().shape({
  name: yup
    .string()
    .required("Student name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9+\-\s()]{10,15}$/, "Invalid phone number format"),

    avatar: yup.string().nullable().optional(),
  
  country: yup
    .string()
    .required("Country is required"),
  
  targetBand: yup
    .number()
    .required("Target band is required")
    .min(0, "Target band must be at least 0")
    .max(9, "Target band must be at most 9"),
  
  targetExam: yup
    .string()
    .required("Target exam is required")
    .oneOf(["IELTS Academic", "IELTS General", "PTE", "TOEFL"], "Invalid exam type"),
  
  currentLevel: yup
    .string()
    .required("Current level is required")
    .oneOf(["Beginner", "Elementary", "Intermediate", "Upper Intermediate", "Advanced"], "Invalid level"),
  
  enrollmentDate: yup
    .string()
    .required("Enrollment date is required"),
  
  isExternal: yup
    .boolean()
    .required("External status is required"),
  
  companyId: yup
    .string()
    .required("Company ID is required"),
});

export type StudentFormData = yup.InferType<typeof studentSchema>;