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
  RotateCw,
  AlertTriangle,
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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; course: IeltsCourse | null }>({
    isOpen: false,
    course: null,
  });

  const { data: courses = [], isLoading, refetch } = useAppQuery<IeltsCourse[]>({
    url: "/ielts/",
    queryKey: ["ielts-courses"],
  });

  const { mutate: deleteCourse, isPending: isDeleting } = useAppMutation({
    url: "/ielts",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ielts-courses"] });
      refetch();
      setDeleteModal({ isOpen: false, course: null });
    },
  });

  const publishedCourses = courses.filter((c) => c.isPublished === true);
  const draftCourses = courses.filter((c) => c.isPublished === false);
  const displayedCourses = showDraft ? draftCourses : publishedCourses;

  const getTypeColor = (type: any) => {
    const typeStr = typeof type === "object" ? type?.name : type;
    const normalizedType = typeStr?.toLowerCase() || "";
    
    switch (normalizedType) {
      case "academic":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "general training":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "ukvi":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ 
      queryKey: ["ielts-courses"],
      exact: true,
      refetchType: 'active'
    });
    refetch();
  };

  const handleDeleteClick = (course: IeltsCourse) => {
    setDeleteModal({ isOpen: true, course });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.course) {
      deleteCourse({ id: deleteModal.course.id });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, course: null });
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

          {/* HEADER */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md mb-2">
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-xs text-slate-600 font-medium tracking-wide">IELTS Management</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Program Curriculums</h1>
                <p className="text-slate-500 text-sm mt-0.5">Manage and organize your system IELTS courses</p>
              </div>

              <button
                onClick={() => setOpenAdd(true)}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Course
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-1 bg-slate-200/60 rounded-lg p-1 border border-slate-200 w-fit">
              <button
                onClick={() => setShowDraft(false)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !showDraft
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Live Courses
              </button>
              <button
                onClick={() => setShowDraft(true)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  showDraft
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Draft Courses
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Courses</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{courses.length}</p>
                  </div>
                  <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Live Courses</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">{publishedCourses.length}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Draft Courses</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">{draftCourses.length}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {showDraft ? "Draft Courses" : "Published Courses"}
                </h2>
                <p className="text-sm text-slate-500">
                  {displayedCourses.length} course{displayedCourses.length !== 1 ? 's' : ''} available
                </p>
              </div>
              
            
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-16 bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-600 font-medium">Loading course data...</p>
                  </div>
                </div>
              ) : displayedCourses.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="inline-flex p-4 bg-slate-50 border border-slate-200 rounded-full mb-4">
                      <BookOpen className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 mb-1">No courses found</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-5">
                      {showDraft ? "You don't have any draft courses ready." : "No published courses are current available."}
                    </p>
                    <button
                      onClick={() => setOpenAdd(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
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
                      ? course.ieltsType?.name || "Academic"
                      : "Academic";

                  const priceValue =
                    typeof course.price === "string"
                      ? parseFloat(course.price)
                      : course.price ?? 0;

                  const imageSrc = course.thumbnail?.url || "";

                  return (
                    <div
                      key={`${course.id}-${course.thumbnail?.id || index}-${index}`}
                      className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
                    >
                      {/* IMAGE */}
                      <div className="relative h-44 bg-slate-100 border-b border-slate-100 overflow-hidden">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="w-10 h-10 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border shadow-sm ${getTypeColor(course.ieltsType)}`}>
                            {typeLabel}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border shadow-sm ${
                            course.isPublished
                              ? "bg-emerald-600 border-emerald-700 text-white"
                              : "bg-amber-500 border-amber-600 text-white"
                          }`}>
                            {course.isPublished ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="font-bold text-slate-900 text-base mb-1.5 line-clamp-1">
                            {course.title}
                          </h2>
                          <p className="text-sm text-slate-500 line-clamp-2 mb-4"
                          dangerouslySetInnerHTML={{__html: course.description}}
                            // {/* {course.description || "No description available"} */}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div>
                              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Price</span>
                              <p className="text-lg font-bold text-slate-900">
                                NPR {priceValue.toLocaleString()}
                              </p>
                            </div>
                            {priceValue > 0 && (
                              <div className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                                <TrendingUp className="w-3 h-3" />
                                <span>Active</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                setOpenAdd(false);
                                setEditingCourse(null);
                                navigate(`/ielts/course/${course.id}`);
                              }}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors duration-150"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </button>

                            <button
                              onClick={() => setEditingCourse(course)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold transition-colors duration-150"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteClick(course)}
                              className="inline-flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors duration-150"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {openAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200 transition-transform duration-200 scale-100">
            <button
              onClick={() => setOpenAdd(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg transition-colors z-10 border border-transparent hover:border-slate-200"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
            <AddIeltsCourse
              onClose={() => {
                setOpenAdd(false);
                refreshData();
              }}
            />
          </div>
        </div>
      )}

      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200 transition-transform duration-200 scale-100">
            <button
              onClick={() => setEditingCourse(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 rounded-lg transition-colors z-10 border border-transparent hover:border-slate-200"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
            <EditIeltsCourse
              course={editingCourse}
              onClose={() => {
                setEditingCourse(null);
                refreshData();
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-red-50 rounded-full border border-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">Delete Course</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete <span className="font-medium text-slate-700">"{deleteModal.course?.title}"</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}