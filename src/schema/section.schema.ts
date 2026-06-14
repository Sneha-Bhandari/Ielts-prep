// import * as yup from "yup";

// export const sectionSchema = yup.object({
//   name: yup
//     .string()
//     .required("Section name is required"),
//   description: yup.string().required("section description is required")
// });

import * as yup from "yup";

export const sectionSchema = yup.object().shape({
  title: yup.string()
    .required("Section title is required")
    .max(300, "Section title must be less than 300 characters"),
  
  description: yup.string()
    .required("Section description is required")
    .max(2000, "Description must be less than 2000 characters"),
  
  orderNo: yup.number()
    .integer("Order number must be an integer")
    .min(0, "Order number cannot be negative")
    .required("Order number is required"),
  
  ielts: yup.string()
    .nullable()
    .notRequired()
    .transform((value) => value === "" ? null : value),
});

export type SectionFormData = yup.InferType<typeof sectionSchema>;