import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, BookOpen, ArrowLeft, Eye, Edit, AlertTriangle } from "lucide-react";

import {
    useAppQuery,
    useAppMutation,
} from "../../../../lib/react-query";

import { useQueryClient } from "@tanstack/react-query";
import type { Lesson } from "../../../../interfaces/ielts.interface";
import AddLesson from "./[id]/AddLesson";
import EditLesson from "./[id]/EditLesson";

export default function LessonDashboard() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { sectionId } = useParams<{ sectionId: string }>();

    const [openAdd, setOpenAdd] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; lesson: Lesson | null }>({
        isOpen: false,
        lesson: null,
    });

    if (!sectionId) {
        return <div>Invalid section</div>;
    }

    const { data: lessons = [], isLoading } = useAppQuery<Lesson[]>({
        url: `/lessons/`,
        queryKey: ["lessons"],
    });


    const filteredLessons = lessons.filter(
        (lesson) => lesson.section?.id === sectionId
    );

    const { mutate: deleteLesson, isPending: isDeleting } = useAppMutation({
        url: "/lessons",
        type: "delete",
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons"] });
            setDeleteModal({ isOpen: false, lesson: null });
        },
    });

    const handleDeleteClick = (lesson: Lesson) => {
        setDeleteModal({ isOpen: true, lesson });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.lesson) {
            deleteLesson({ id: deleteModal.lesson.id });
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ isOpen: false, lesson: null });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-slate-50">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">
                    Loading lessons...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 text-slate-800 antialiased">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors bg-white hover:bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl shadow-sm"
                        >
                            <ArrowLeft size={16} />
                            Back to Sections
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Lessons Dashboard
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Section ID: {sectionId}
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenAdd(true)}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-colors duration-200"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Add Lesson
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                <BookOpen size={22} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Lessons</p>
                                <h2 className="text-2xl font-bold text-slate-900">{filteredLessons.length}</h2>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <BookOpen size={22} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Lessons</p>
                                <h2 className="text-2xl font-bold text-slate-900">{filteredLessons.length}</h2>
                            </div>
                        </div>
                    </div>

                    {filteredLessons.length === 0 ? (
                        <div className="bg-white py-16 px-4 text-center rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto mt-8">
                            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <BookOpen className="text-slate-400" size={24} />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">No Lessons Found</h2>
                            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
                                Get started by creating your first lesson using the button above.
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredLessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start gap-3">
                                            <h2 className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                                                {lesson.title}
                                            </h2>
                                            <span className="p-1.5 bg-slate-50 text-slate-400 rounded-lg shrink-0 border border-slate-100">
                                                <BookOpen size={16} />
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: lesson.content }}
                                        />
                                        {/* {lesson.content || (
                                                <span className="italic text-slate-400">No content provided.</span>
                                            )} */}

                                    </div>

                                    <div className="mt-5 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-3.5">
                                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                                Duration: {lesson.duration || "—"} min
                                            </span>
                                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                                Order: {lesson.order ?? "—"}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(`/ielts/course/section/${sectionId}/lesson/${lesson.id}`)
                                                }
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-semibold transition-colors"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>

                                            <button
                                                onClick={() => setEditingLesson(lesson)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-xl text-xs font-semibold transition-colors"
                                            >
                                                <Edit size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => lesson.id && handleDeleteClick(lesson)}
                                                className="inline-flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 rounded-xl transition-colors"
                                                title="Delete lesson"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {openAdd && (
                <AddLesson
                    sectionId={sectionId}
                    onClose={() => {
                        setOpenAdd(false);
                        queryClient.invalidateQueries({
                            queryKey: ["lessons"],
                        });
                    }}
                />
            )}

            {editingLesson && (
                <EditLesson
                    lesson={editingLesson}
                    onClose={() => {
                        setEditingLesson(null);
                        queryClient.invalidateQueries({
                            queryKey: ["lessons"],
                        });
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-2 bg-red-50 rounded-full border border-red-100">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900">Delete Lesson</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Are you sure you want to delete <span className="font-medium text-slate-700">"{deleteModal.lesson?.title}"</span>?
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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