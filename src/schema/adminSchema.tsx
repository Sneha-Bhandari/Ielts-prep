// src/schema/admin.schema.ts
import * as yup from "yup";

// Admin Schema (has company fields)
export const adminSchema = yup.object().shape({
  country: yup
    .string()
    .required("Country is required"),
  
  companyName: yup
    .string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters"),
  
  companyAddress: yup
    .string()
    .required("Company address is required"),
  
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  
  companyLogo: yup
    .string()
    .required("Company logo is required"),
  
  
  website: yup
    .string()
    .url("Must be a valid URL")
    .nullable(),
  
  panNo: yup
    .string()
    .required("PAN number is required"),
  
  registrationDocument: yup
    .string()
    .required("Registration document is required"),
  
  
  plan: yup
    .string()
    .required("Plan is required"),
  
  paymentStatus: yup
    .string()
    .oneOf(["pending", "completed", "failed"], "Invalid payment status")
    .default("pending"),
  
  isActive: yup
    .boolean()
    .default(true),
});

// Company Representative Schema (has admin fields)
export const companyRepresentativeSchema = yup.object().shape({
  admin: yup
    .string()
    .required("Admin name is required"),
  
  name: yup
    .string()
    .required("Name is required"),
  
  contact: yup
    .string()
    .required("Contact is required"),
  
  designation: yup
    .string()
    .required("Designation is required"),
  
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  
    proofDocumentId: yup
    .string()
    .required("Proof document is required"),
  
  
});

export type AdminFormData = yup.InferType<typeof adminSchema>;
export type CompanyRepresentativeFormData = yup.InferType<typeof companyRepresentativeSchema>;