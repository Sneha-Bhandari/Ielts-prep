import * as yup from "yup";

export const teacherSchema = yup.object().shape({

  name: yup
    .string()
    .required("Teacher name is required")
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
  
 profile: yup.string().nullable().optional(),
  
  country: yup
    .string()
    .required("Country is required"),
  
  role: yup
    .string()
    .nullable()
    .optional(),
  
  enrollmentDate: yup
    .string()
    .required("Enrollment date is required"),
  
  proofDocument: yup.string().nullable().optional(),
});

export type TeacherFormData = yup.InferType<typeof teacherSchema>;