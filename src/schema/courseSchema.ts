import * as Yup from "yup";

export const courseSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .required("Course title is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .required("Course description is required"),
  level: Yup.string()
    .oneOf(["Beginner", "Intermediate", "Advanced"], "Invalid level selection")
    .required("Course level is required"),
  price: Yup.number()
    .typeError("Price must be a valid number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  languageid: Yup.string().required("Language selection is required"),
  isPublished: Yup.boolean().default(false),
  thumbnailid: Yup.string()
    .required("Please upload a cover image thumbnail"),
});