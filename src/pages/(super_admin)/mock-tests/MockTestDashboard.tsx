import { Plus, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MockTestDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Mock Tests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage, and monitor your practice examinations.
          </p>
        </div>

        <button
          onClick={() => navigate("/mock-tests/create")}
          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-purple-100"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Add Question</span>
        </button>
      </div>

      {/* Empty State Section */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-12 md:p-20 text-center bg-slate-50/50">
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 ring-8 ring-purple-50/50">
          <ClipboardList size={24} />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900">
          No mock tests yet
        </h3>
        
        <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
          Get started by creating your first mock test and adding questions to it.
        </p>

        <button
          onClick={() => navigate("/mock-tests/create")}
          className="mt-6 text-sm font-medium text-purple-600 hover:text-purple-700 inline-flex items-center gap-1 group"
        >
          Create your first test
          <span className="transform group-hover:translate-x-0.5 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default MockTestDashboard;