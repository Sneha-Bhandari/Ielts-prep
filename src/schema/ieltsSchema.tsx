import * as yup from "yup";

export const ieltsCourseSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .max(200, "Title must be less than 200 characters"),

  description: yup
    .string()
    .required("Description is required")
    .max(5000, "Description must be less than 5000 characters"),

  ieltsType: yup.object().shape({
    id: yup
      .string()
      .required("IELTS type is required"),
  }),

  thumbnail: yup
    .string()
    .required("Thumbnail is required"),

  thumbnailKey: yup
    .string()
    .required("Thumbnail key is required"),

  isPublished: yup
    .boolean()
    .default(false),

  price: yup
    .number()
    .transform((value, originalValue) => {
      // handles "0.00" string from API
      return typeof originalValue === "string"
        ? parseFloat(originalValue)
        : value;
    })
    .min(0, "Price cannot be negative")
    .max(9999, "Price is too high")
    .required("Price is required"),
});

export type IeltsCourseFormData = yup.InferType<typeof ieltsCourseSchema>;