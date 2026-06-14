import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";

import AddIeltsCourse from "./AddIeltsCourse";
import EditIeltsCourse from "./EditIeltsCourse";

import { useAppQuery, useAppMutation } from "../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";

import type { IeltsCourse } from "../../../interfaces/ielts.interface";

export default function IeltsDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openAdd, setOpenAdd] = useState(false);
  const [editingCourse, setEditingCourse] = useState<IeltsCourse | null>(null);
  const [showDraft, setShowDraft] = useState(false);

  // =========================
  // FETCH COURSES
  // =========================
  const { data: courses = [], isLoading } = useAppQuery<IeltsCourse[]>({
    url: "/ielts",
    queryKey: ["ielts-courses"],
  });

  // =========================
  // DELETE COURSE
  // =========================
  const { mutate: deleteCourse } = useAppMutation({
    url: "/ielts",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ielts-courses"] });
    },
  });

  // =========================
  // FILTERS
  // =========================
  const publishedCourses = courses.filter((c) => c.isPublished === true);
  const draftCourses = courses.filter((c) => c.isPublished === false);

  const displayedCourses = showDraft ? draftCourses : publishedCourses;


  const getImageSrc = (thumbnail?: string) => {
    if (!thumbnail) return "";

    if (
      thumbnail.startsWith("data:image") ||
      thumbnail.startsWith("http")
    ) {
      return thumbnail;
    }

    return `${import.meta.env.VITE_API_URL}${thumbnail}`;
  };

  const getTypeColor = (type: any) => {
    const typeStr = typeof type === "object" ? type?.id : type;
    switch (typeStr?.toLowerCase()) {
      case "academic":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "general":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default:
        return "bg-purple-50 text-purple-700 border-purple-100";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                  <LayoutDashboard className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs text-white font-medium">IELTS Dashboard</span>
                </div>
                <h1 className="text-2xl font-bold text-white">Program Curriculums</h1>
                <p className="text-indigo-100 text-sm mt-1">Manage and organize your IELTS courses</p>
              </div>

              <button
                onClick={() => setOpenAdd(true)}
                className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Course
              </button>
            </div>
          </div>

          {/* TABS & METRICS */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 bg-white rounded-xl p-1 border shadow-sm w-fit">
              <button
                onClick={() => setShowDraft(false)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${!showDraft
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                Live Courses
              </button>
              <button
                onClick={() => setShowDraft(true)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${showDraft
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
              >
                Draft Courses
              </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Total Courses</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{courses.length}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-full">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Live Courses</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{publishedCourses.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border-l-4 border-amber-500 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm">Draft Courses</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{draftCourses.length}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-full">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COURSE GRID */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {showDraft ? "Draft Courses" : "Published Courses"}
                </h2>
                <p className="text-sm text-slate-500">
                  {displayedCourses.length} course{displayedCourses.length !== 1 ? 's' : ''} available
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600">Loading courses...</p>
                  </div>
                </div>
              ) : displayedCourses.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-16 bg-white rounded-2xl border">
                    <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                      <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-700 mb-2">No courses found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                      {showDraft ? "You don't have any draft courses" : "No published courses available"}
                    </p>
                    <button
                      onClick={() => setOpenAdd(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Course
                    </button>
                  </div>
                </div>
              ) : (
                displayedCourses.map((course, index) => {
                  const typeLabel =
                    typeof course.ieltsType === "object"
                      ? course.ieltsType?.id
                      : "Academic";

                  const priceValue =
                    typeof course.price === "string"
                      ? parseFloat(course.price)
                      : course.price ?? 0;

                  const imageSrc = getImageSrc(course.thumbnail);

                  return (
                    <div
                      key={`${course.id}-${index}`}
                      className="group bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* IMAGE */}
                      <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="w-12 h-12 text-indigo-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getTypeColor(course.ieltsType)}`}>
                            {typeLabel}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${course.isPublished
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-500 text-white"
                            }`}>
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-5">
                        <h2 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">
                          {course.title}
                        </h2>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                          {course.description || "No description available"}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-xs text-slate-500">Price</span>
                            <p className="text-lg font-bold text-indigo-600">
                              NPR {priceValue.toLocaleString()}
                            </p>
                          </div>
                          {priceValue > 0 && (
                            <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                              <TrendingUp className="w-3 h-3" />
                              <span>Active</span>
                            </div>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-4 flex gap-2">
                          <button
                            // onClick={() => navigate(`/ielts/course/${course.id}/sections`)}
                            onClick={() => {
                              setOpenAdd(false);
                              setEditingCourse(null);
                              navigate(`/ielts/course/${course.id}/sections`);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium transition"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>

                          <button
                            onClick={() => setEditingCourse(course)}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium transition"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this course?")) {
                                deleteCourse({ id: course.id });
                              }
                            }}
                            className="inline-flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg text-sm font-medium transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS AS POPUPS */}
      {openAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
            <button
              onClick={() => setOpenAdd(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition z-10"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <AddIeltsCourse
              onClose={() => {
                setOpenAdd(false);
                queryClient.invalidateQueries({
                  queryKey: ["ielts-courses"],
                });
              }}
            />
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slideUp">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition z-10"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
            <EditIeltsCourse
              course={editingCourse}
              onClose={() => {
                setEditingCourse(null);
                queryClient.invalidateQueries({
                  queryKey: ["ielts-courses"],
                });
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}