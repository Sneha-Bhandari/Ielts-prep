import { Type, CheckCircle2 } from "lucide-react";

interface ListeningQuestion {
  id: string;
  questionType: "MCQ" | "FILL_BLANK";
  question: string;
  correctAnswer: string;
  audio?: File | null;
}

interface Props {
  question: ListeningQuestion;
}

const FillBlankRenderer = ({ question }: Props) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header Badge */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center gap-2">
        <Type size={16} className="text-purple-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Fill In The Blank
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* Question Prompt */}
        <p className="text-base text-slate-800 font-medium leading-relaxed">
          {question.question || "No question prompt provided yet."}
        </p>

        {/* Student Input Field Simulation */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
            Student Input Preview
          </label>
          <input
            type="text"
            placeholder="Type your answer here..."
            disabled
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-slate-400 cursor-not-allowed"
          />
        </div>

        {/* Evaluation / Admin Solution Key */}
        {question.correctAnswer && (
          <div className="mt-2 pt-4 border-t border-slate-100 flex items-start gap-2.5 bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Correct Answer Key
              </span>
              <span className="text-sm font-bold text-emerald-700 block mt-0.5">
                {question.correctAnswer}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FillBlankRenderer;