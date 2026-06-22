import { useState } from "react";
import { Upload, AudioLines, Layers, HelpCircle, CheckCircle, Eye } from "lucide-react";
import QuestionRenderer from "./QuestionRenderer";

export interface CreateListeningQn {
  id: string;
  questionType: "MCQ" | "FILL_BLANK";
  question: string;
  correctAnswer: string;
  options?: string[];
  audio?: File | null;
}

const CreateListeningQn = () => {
  const [questionType, setQuestionType] = useState<"MCQ" | "FILL_BLANK">("MCQ");
  const [audio, setAudio] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");

  const [createdQuestion, setCreatedQuestion] = useState<CreateListeningQn | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateListeningQn = {
      id: Date.now().toString(),
      questionType,
      question,
      correctAnswer,
      audio,
      ...(questionType === "MCQ" && {
        options: [optionA, optionB, optionC, optionD],
      }),
    };

    setCreatedQuestion(payload);
    console.log(payload);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Create Listening Question
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Add fresh media files, configure dynamic prompts, and manage solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
          
          {/* Custom File Uploader */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <AudioLines size={16} className="text-purple-500" />
              Upload Audio Clip
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${audio ? 'border-purple-500 bg-purple-50/20' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'}`}>
              <input
                type="file"
                id="audio-upload"
                accept="audio/*"
                onChange={(e) => setAudio(e.target.files?.[0] || null)}
                className="hidden"
              />
              <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${audio ? 'bg-purple-600 text-white' : 'bg-white shadow-sm border border-slate-200 text-slate-500'}`}>
                  <Upload size={16} />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {audio ? audio.name : "Click to upload audio file"}
                </p>
                <p className="text-xs text-slate-400">
                  {audio ? `${(audio.size / (1024 * 1024)).toFixed(2)} MB` : "Supports MP3, WAV up to 20MB"}
                </p>
              </label>
            </div>
          </div>

          {/* Question Type - Segmented Controls */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Layers size={16} className="text-purple-500" />
              Question Format
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setQuestionType("MCQ")}
                className={`py-2 text-sm font-medium rounded-lg transition-all ${questionType === "MCQ" ? "bg-white text-purple-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Multiple Choice
              </button>
              <button
                type="button"
                onClick={() => setQuestionType("FILL_BLANK")}
                className={`py-2 text-sm font-medium rounded-lg transition-all ${questionType === "FILL_BLANK" ? "bg-white text-purple-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
              >
                Fill in the Blank
              </button>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <HelpCircle size={16} className="text-purple-500" />
              Question Text
            </label>
            <textarea
              id="question"
              rows={3}
              placeholder={questionType === "MCQ" ? "What is the primary speaker's objective?" : "The speaker arrived at the station at [blank] PM."}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none"
            />
          </div>

          {/* Conditional MCQ Choice Inputs */}
          {questionType === "MCQ" && (
            <div className="space-y-3 bg-slate-50/50 p-4 border border-slate-100 rounded-xl animate-fadeIn">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Answer Options</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: "A", val: optionA, set: setOptionA },
                  { label: "B", val: optionB, set: setOptionB },
                  { label: "C", val: optionC, set: setOptionC },
                  { label: "D", val: optionD, set: setOptionD }
                ].map((item) => (
                  <div key={item.label} className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.label}
                    </span>
                    <input
                      type="text"
                      placeholder={`Option ${item.label}`}
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg pl-10 pr-3.5 py-2 text-sm bg-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Target Answer */}
          <div className="space-y-2">
            <label htmlFor="correctAnswer" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle size={16} className="text-purple-500" />
              Correct Answer Key
            </label>
            <input
              id="correctAnswer"
              type="text"
              placeholder={questionType === "MCQ" ? "e.g., Option A" : "e.g., 4:30"}
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
            />
          </div>

          {/* Actions */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-medium py-3 rounded-xl transition-colors shadow-sm shadow-purple-100"
          >
            Create Question
          </button>
        </form>

        {/* Sticky Preview Output Container */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 px-1">
            <Eye size={16} className="text-slate-400" />
            Live Preview
          </div>

          {createdQuestion ? (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 shadow-sm">
              <QuestionRenderer question={createdQuestion} />
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-white text-slate-400 text-sm">
              Fill out the form configurations to instantly render your live student viewport layout preview here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateListeningQn;