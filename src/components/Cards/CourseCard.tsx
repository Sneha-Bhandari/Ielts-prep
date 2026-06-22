import { Link } from "react-router-dom";
import { Globe, GraduationCap, Trash2 } from "lucide-react";

interface Thumbnail {
  id: string;
  url: string;
}

interface Language {
  name: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
  language: Language;
  level: string;
  isPublished: boolean;
  price: string;
}

interface CourseCardProps {
  course: Course;
  viewType: string;
  role: "superadmin" | "student";
  onDeleteClick?: (id: string) => void;
}

export default function CourseCard({ course, viewType, role, onDeleteClick }: CourseCardProps) {
  const targetLink = role === "superadmin" 
    ? `/courses/course/${course.id}/sections` 
    : `/student/courses/${course.id}`;

  if (viewType === "list") {
    return (
      <div className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <Link to={targetLink} className="relative w-full sm:w-48 h-36 flex-shrink-0 bg-slate-100 overflow-hidden block">
          <img
            src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
        </Link>

        <div className="p-5 flex flex-col sm:flex-row flex-1 justify-between gap-4">
          <Link to={targetLink} className="space-y-1.5 max-w-2xl flex-1 block">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${course.isPublished
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                : "bg-amber-50 text-amber-700 border-amber-200/60"
                }`}>
                {course.isPublished ? "Published" : "Draft"}
              </span>
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" /> {course.level} • {course.language?.name || "English"}
              </span>
            </div>

            <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
              {course.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {course.description}
            </p>
          </Link>

          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
            <div className="text-left sm:text-right">
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
              <span className="text-base font-semibold text-slate-900">
                NPR {Number(course.price || 0).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {role === "superadmin" && onDeleteClick ? (
                <button 
                  onClick={(e) => { e.preventDefault(); onDeleteClick(course.id); }}
                  className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link to={targetLink} className="text-xs px-3 py-1.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                  Buy Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={targetLink} className="relative h-48 w-full bg-slate-100 overflow-hidden block">
        <img
          src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute top-3 inset-x-3 flex justify-between items-center">
          <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-medium text-slate-700 shadow-sm border border-slate-200/40">
            {course.level}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium shadow-sm border ${course.isPublished
            ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            : "bg-amber-50 text-amber-700 border-amber-200/60"
            }`}>
            {course.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <Link to={targetLink} className="block">
          <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
            {course.title}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          <div className="mt-4 flex gap-3 text-xs font-medium text-slate-500 border-b border-slate-100 pb-3">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              {course.level}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              {course.language?.name || "English"}
            </span>
          </div>
        </Link>

        <div className="mt-4 pt-0.5 flex items-center justify-between">
          <div>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
            <span className="text-base font-semibold text-slate-900">
              NPR {Number(course.price || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {role === "superadmin" && onDeleteClick ? (
              <button
                onClick={(e) => { e.preventDefault(); onDeleteClick(course.id); }}
                className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors" 
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link to={targetLink} className="text-xs text-indigo-600 font-semibold hover:underline">
                Buy Now →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}