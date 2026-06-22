import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import type { IeltsCourse } from "../../interfaces/ielts.interface";
import { useAppQuery } from "../../lib/react-query";

export default function StudentCourseDashboard() {
  const navigate = useNavigate();

  const { data: courses = [], isLoading } =
    useAppQuery<IeltsCourse[]>({
      url: "/ielts/published/",
      queryKey: ["ielts"],
    });

  // Clean, Production-Grade Skeleton Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 lg:p-12 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded-md w-56" />
            <div className="h-4 bg-slate-200 rounded-md w-96" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-200 aspect-video w-full" />
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-slate-200 rounded w-5/6" />
                    <div className="h-4 bg-slate-200 rounded w-full" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between">
                    <div className="h-4 bg-slate-200 rounded w-24" />
                    <div className="h-4 bg-slate-200 rounded w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 lg:p-12 text-slate-900 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Choose IELTS Course
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Select a targeted learning path to continue your preparation curriculum.
          </p>
        </div>

        {/* Course Card Grid Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/studentIelts/course/${course.id}`)}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col group"
            >
              {/* Media Block Layout */}
              <div className="aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                {course.thumbnail?.url ? (
                  <img
                    src={course.thumbnail.url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100/50">
                    <BookOpen size={32} className="stroke-[1.5] text-slate-300 mb-1" />
                    <span className="text-xs font-medium text-slate-400">Course Track</span>
                  </div>
                )}
              </div>

              {/* Content Context Module */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h2 className="font-semibold text-base text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors duration-150">
                    {course.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {course.description || "No track documentation provided for this segment."}
                  </p>
                </div>

                {/* Interactive Dynamic Action Row */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors duration-150">
                  <span>Start Learning</span>
                  <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 transform group-hover:translate-x-0.5 transition-all duration-150" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}