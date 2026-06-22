import * as Yup from "yup";

export const listeningQuestionSchema =
  Yup.object({
    question: Yup.string().required(),

    correctAnswer:
      Yup.string().required(),

    questionType:
      Yup.string().required(),
  });