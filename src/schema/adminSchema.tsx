import * as Yup from "yup";
import type { AdminFormValues } from "../interfaces/admin";

export const adminSchema: Yup.Schema<AdminFormValues> = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  
  country: Yup.string()
    .required("Country is required")
    .min(2, "Country must be at least 2 characters"),
  
  companyId: Yup.string()
    .required("Please select a company"),
  
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords must match")
    .required("Please confirm your password"),
  
  role: Yup.string()
    .oneOf(['admin', 'super_admin'], "Invalid role")
    .default('admin'),
});