import { useNavigate } from "react-router-dom";
import { Plus, Headphones } from "lucide-react";
import { useState } from "react";

interface ListeningQuestion {
  id: string;
  question: string;
}

const ListeningDashboard = () => {
  const navigate = useNavigate();

  // mock state (replace with API later)
  const [questions] = useState<ListeningQuestion[]>([]);

  const handleAddQuestion = () => {
    navigate("/mock-tests/listening/create");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="w-6 h-6 text-purple-600" />
            Listening Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage listening questions for this mock test
          </p>
        </div>

        {/* Top Right Button */}
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Listening Qns
        </button>
      </div>

      {/* Content */}
      {questions.length === 0 ? (
        // EMPTY STATE
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Headphones className="w-10 h-10 text-purple-600" />
          </div>

          <h2 className="text-lg font-semibold text-gray-700">
            No Listening Questions Yet
          </h2>

          <p className="text-gray-500 mt-1">
            Start by adding your first listening question.
          </p>

          <button
            onClick={handleAddQuestion}
            className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            + Add First Question
          </button>
        </div>
      ) : (
        // QUESTIONS LIST (future)
        <div className="grid gap-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-white border rounded-md shadow-sm"
            >
              {q.question}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListeningDashboard;