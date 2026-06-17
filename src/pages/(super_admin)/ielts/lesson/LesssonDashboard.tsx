import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, BookOpen } from "lucide-react";

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
    const { sectionId } = useParams<{ sectionId: string }>();

    const [openAdd, setOpenAdd] = useState(false);
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

    if (!sectionId) {
        return <div>INvalid section</div>
    }

    const { data: lessons = [], isLoading } = useAppQuery<Lesson[]>({
        url: `/lessons`,
        queryKey: ["lessons"],
    });

    // DELETE LESSON
    const { mutate: deleteLesson } = useAppMutation({
        url: "/lessons",
        type: "delete",
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lessons", sectionId] });
        },
    });

    const handleDelete = (id: string) => {
        if (!confirm("Delete this lesson?")) return;
        deleteLesson({ id });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading lessons...
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-slate-50 p-6">
                <div className="max-w-7xl mx-auto">

                    {/* HEADER */}
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Lessons</h1>
                            <p className="text-sm text-slate-500">
                                Section ID: {sectionId}
                            </p>
                        </div>

                        <button
                            onClick={() => setOpenAdd(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Lesson
                        </button>
                    </div>

                    {/* STATS */}
                    <div className="bg-white p-4 rounded-xl shadow mb-6">
                        <h2 className="text-xl font-bold">
                            Total Lessons: {lessons.length}
                        </h2>
                    </div>

                    {/* TABLE VIEW */}
                    {lessons.length === 0 ? (
                        <div className="bg-white p-10 text-center rounded-xl shadow">
                            <BookOpen className="mx-auto mb-3 text-slate-400" />
                            <h2 className="text-xl font-semibold">No Lessons Found</h2>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-100 text-left">
                                    <tr>
                                        <th className="p-3">Title</th>
                                        <th className="p-3">Content</th>
                                        <th className="p-3">Duration</th>
                                        <th className="p-3">Order</th>
                                        <th className="p-3 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lessons.map((lesson) => (
                                        <tr key={lesson.id} className="border-t">
                                            <td className="p-3 font-medium">
                                                {lesson.title}
                                            </td>

                                            <td className="p-3 text-slate-500">
                                                {lesson.content}
                                            </td>

                                            <td className="p-3">
                                                {lesson.duration} min
                                            </td>

                                            <td className="p-3">
                                                {lesson.order ?? 0}
                                            </td>

                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() =>
                                                        lesson.id && handleDelete(lesson.id)
                                                    }
                                                    className="bg-red-50 text-red-600 px-3 py-1 rounded-lg"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingLesson(lesson)}
                                                    className="bg-red-50 text-red-600 px-3 py-1 rounded-lg"
                                                >
                                                    {/* <Trash2 size={14} /> */}
                                                    edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>



            {/* ADD MODAL */}
            {openAdd && (
                <AddLesson
                    sectionId={sectionId!}
                    onClose={() => {
                        setOpenAdd(false);
                        queryClient.invalidateQueries({
                            queryKey: ["lessons", sectionId],
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
                            queryKey: ["lessons", sectionId],
                        });
                    }}
                />
            )}
        </>
    );
}

