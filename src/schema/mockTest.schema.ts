import * as Yup from "yup";

export const mockTestSchema = Yup.object({
  taskName: Yup.string().required("Task name is required"),

  ieltsTypeId: Yup.string().required(
    "IELTS Type is required"
  ),
});