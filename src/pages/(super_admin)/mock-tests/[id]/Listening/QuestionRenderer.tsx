import FillBlankRenderer from "./forms/FillBlankRenderer";
import MCQRenderer from "./forms/MCQRenderer";

interface Props {
  question: any;
}

const QuestionRenderer = ({
  question,
}: Props) => {
  switch (question.questionType) {
    case "MCQ":
      return (
        <MCQRenderer question={question} />
      );

    case "FILL_BLANK":
      return (
        <FillBlankRenderer
          question={question}
        />
      );

    default:
      return null;
  }
};

export default QuestionRenderer;