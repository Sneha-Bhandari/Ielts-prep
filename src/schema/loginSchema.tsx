import * as Yup from "yup";
import  type { LoginValues } from "../interfaces/login";

export const loginSchema: Yup.Schema<LoginValues> = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});