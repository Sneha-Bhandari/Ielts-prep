import {  CheckCircle2, LucideFlaskConicalOff } from "lucide-react";

interface MCQQuestion {
  id: string;
  questionType: "MCQ" | "FILL_BLANK";
  question: string;
  correctAnswer: string;
  options?: string[];
  audio?: File | null;
}

interface Props {
  question: MCQQuestion;
}

const MCQRenderer = ({ question }: Props) => {
  // Helper to convert index into A, B, C, D labels
  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header Badge */}
      <div className="bg-slate-50 border-b border-slate-100 px-5 py-3 flex items-center gap-2">
        <LucideFlaskConicalOff size={16} className="text-purple-600" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Multiple Choice Question
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Question Prompt */}
        <p className="text-base text-slate-800 font-medium leading-relaxed">
          {question.question || "No question prompt provided yet."}
        </p>

        {/* Interactive Option Cards */}
        <div className="space-y-2.5">
          {question.options?.map((option: string, index: number) => {
            const letterLabel = getOptionLabel(index);
            // Optional: Highlight option matching the answer key string format if desired
            const isCorrect = question.correctAnswer?.toLowerCase().includes(option.toLowerCase()) || 
                              question.correctAnswer?.toUpperCase() === letterLabel;

            return (
              <label
                key={index}
                className={`flex items-center gap-3 border rounded-xl p-3.5 text-sm font-medium transition-all cursor-pointer ${
                  isCorrect 
                    ? "border-emerald-200 bg-emerald-50/40 text-emerald-900" 
                    : "border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                <div className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border transition-all ${
                  isCorrect 
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-100" 
                    : "bg-white border-slate-200 text-slate-400 group-hover:border-slate-300"
                }`}>
                  {letterLabel}
                </div>
                
                <span className="leading-tight">{option}</span>
              </label>
            );
          })}
        </div>

        {/* Evaluation / Admin Solution Key */}
        {question.correctAnswer && (
          <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 bg-purple-50/50 rounded-xl p-3 border border-purple-100/50">
            <CheckCircle2 size={18} className="text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-purple-800">
                Correct Answer Key
              </span>
              <span className="text-sm font-bold text-purple-700 block mt-0.5">
                {question.correctAnswer}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQRenderer;