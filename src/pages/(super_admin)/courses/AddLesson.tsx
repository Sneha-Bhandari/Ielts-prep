import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { 
  Plus, 
  ArrowLeft, 
  Video, 
  Clock, 
  FileText, 
  Trash2, 
  Loader2,
  AlertTriangle
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation, useAppQuery } from "../../../lib/react-query";
import { toast } from "react-toastify";

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoId: string;
  duration: number;
  order: number;
}

interface SectionDetails {
  id: string;
  title: string;
  lessons?: Lesson[];
}

export default function AddLesson() {
  const { entityId, sectionId } = useParams<{ entityId: string; sectionId: string }>();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();

  // Ensure these parameters exist to safely satisfy TypeScript types below
  const safeSectionId = sectionId || "";
  const safeEntityId = entityId || "";

  // 1. CONTEXT DETECTION (To know where to return user on navigation)
  const isIelts = pathname.includes("/ielts");
  const backUrl = isIelts 
    ? `/ielts/${safeEntityId}/sections` 
    : `/courses/course/${safeEntityId}/sections`;

  // UI state hooks
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Field parameters state management
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);
  const [order, setOrder] = useState<number>(1);

  // FETCH LESSONS BY SECTION
  const { data: sectionData, isLoading } = useAppQuery<SectionDetails>({
    url: `/sections/${safeSectionId}`,
    queryKey: ["section-lessons", safeSectionId],
    // Only run the query if we have a valid route param
    enabled: !!sectionId, 
  });

  const lessonsList = sectionData?.lessons || [];

  // MUTATION: POST NEW LESSON
  const { mutate: createLesson, isPending: isCreating } = useAppMutation({
    url: "/lessons",
    type: "post",
    onSuccess: () => {
      toast.success("Lesson successfully mapped to timeline! 🚀");
      queryClient.invalidateQueries({ queryKey: ["section-lessons", safeSectionId] });
      resetForm();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to append lesson resource.");
    },
  });

  // MUTATION: DELETE LESSON
  const { mutate: deleteLesson, isPending: isDeleting } = useAppMutation({
    url: deleteConfirmId ? `/lessons/${deleteConfirmId}` : "/lessons",
    type: "delete",
    onSuccess: () => {
      toast.success("Lesson purged successfully.");
      queryClient.invalidateQueries({ queryKey: ["section-lessons", safeSectionId] });
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error removing targeted lesson.");
    }
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setVideoId("");
    setDuration(0);
    setOrder(lessonsList.length + 1);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sectionId) return;

    createLesson({
      data: {
        section: safeSectionId, // TypeScript is happy now
        title: title,
        content: content,
        videoId: videoId,
        duration: Number(duration),
        order: Number(order)
      }
    });
  };

  // Guard clause against empty parameters
  if (!sectionId || !entityId) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm font-medium text-slate-500">Missing Route Mapping Parameters...</p>
        <Link to="/courses/categories" className="text-xs text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl inline-block">
          Return Home
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/40 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Assembling Module Matrix Layout...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/40 min-h-screen font-sans antialiased">
      
      {/* HEADER SECTION BAR */}
      <div className="flex items-center gap-3">
        <Link to={backUrl} className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 shadow-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Section Chapter Timeline</span>
          <h1 className="text-xl font-bold text-slate-900">{sectionData?.title || "Manage Resource Blocks"}</h1>
        </div>
      </div>

      {/* COMPONENT CONTROL HEADER BAR */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-700">{lessonsList.length} Embedded Lessons</span>
        </div>
        <button 
          onClick={() => {
            setOrder(lessonsList.length + 1);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Asset Lesson
        </button>
      </div>

      {/* CORE TIMELINE RENDERING GRID */}
      <div className="space-y-3">
        {lessonsList.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-2">
            <p className="text-sm font-medium text-slate-500">No core assets mapped to this section context timeline block yet.</p>
            <button onClick={() => setIsModalOpen(true)} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              Upload First Asset Block
            </button>
          </div>
        ) : (
          lessonsList.map((lesson) => (
            <div key={lesson.id} className="group bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-600">
                  {lesson.order}
                </div>
                <div className="truncate space-y-0.5">
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">{lesson.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    {lesson.videoId && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded">
                        <Video className="w-3 h-3" /> Video Stream Attached
                      </span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration} mins</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setDeleteConfirmId(lesson.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* INJECT MODAL POPUP FORM COMPONENT */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-base font-bold text-slate-900">Add Asset Stream Record</h3>
              <p className="text-xs text-slate-400 mt-0.5">Publish your syllabus block contents cleanly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Lesson Title *</label>
                <input type="text" required placeholder="e.g., Reading Masterclass Part 1" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Vimeo / YouTube Video ID</label>
                <input type="text" placeholder="e.g., v_73892183" value={videoId} onChange={(e) => setVideoId(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Duration (Minutes)</label>
                <input type="number" min={0} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50" />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Execution Sequence Rank Number (Order)</label>
                <input type="number" min={1} required value={order} onChange={(e) => setOrder(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50" />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Rich Content / Markdown Structure Descriptions</label>
                <textarea placeholder="Enter readable copy blocks or dynamic context data here..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 h-32 resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button type="button" disabled={isCreating} onClick={resetForm} className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100">Cancel</button>
              <button type="submit" disabled={isCreating || !title.trim()} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1 shadow-sm">
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Append Lesson Node"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP MODAL OVERLAY: REMOVE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 text-center">
            <div className="h-12 w-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Purge Resource Node?</h3>
              <p className="text-xs text-slate-400 mt-1">This operation breaks references entirely on database execution logs.</p>
            </div>
            <div className="flex justify-center gap-2 pt-1.5">
              <button type="button" disabled={isDeleting} onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">Cancel</button>
              <button type="button" disabled={isDeleting} onClick={() => deleteLesson({})} className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-1 shadow-sm">
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Removal"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}