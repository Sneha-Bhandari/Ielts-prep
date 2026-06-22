export interface MockTest {
  id: string;
  taskName: string;
  ieltsTypeId: string;
}

export interface Module {
  id: string;
  name: string;
}




export interface ListeningQuestion {
  id: string;
  questionType: "MCQ" | "FILL_BLANK";

  audio?: File | null;

  question: string;
  correctAnswer: string;

  options?: string[];
}