import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  X,
  BookOpen,
  Layers,
  ArrowLeft,
  Eye,
  AlertTriangle,
} from "lucide-react";

import type { Section } from "../../../../interfaces/ielts.interface";
import { useAppQuery, useAppMutation } from "../../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";

import CreateSectionPage from "./[id]/CreateSectionPage";
import EditSection from "./[id]/EditSection";

export default function SectionDashboard() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { courseId } = useParams<{ courseId: string }>();

  const [openAdd, setOpenAdd] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; section: Section | null }>({
    isOpen: false,
    section: null,
  });

  const { data: sections = [], isLoading } = useAppQuery<Section[]>({
    url: "/sections/",
    queryKey: ["sections"],
  });

  const filteredSections = sections.filter(
    (section) => section.ielts?.id === courseId
  );

  const { mutate: deleteSection, isPending: isDeleting } = useAppMutation({
    url: "/sections",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setDeleteModal({ isOpen: false, section: null });
    },
  });

  const handleDeleteClick = (section: Section) => {
    setDeleteModal({ isOpen: true, section });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.section) {
      deleteSection({ id: deleteModal.section.id });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, section: null });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-slate-50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Loading dashboard...
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
              Back to Courses
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Sections Dashboard
              </h1>
              
            </div>

            <button
              onClick={() => setOpenAdd(true)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-indigo-200 transition-colors duration-200"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Section
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Layers size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Sections</p>
                <h2 className="text-2xl font-bold text-slate-900">{filteredSections.length}</h2>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Active Course Items</p>
                <h2 className="text-2xl font-bold text-slate-900">{filteredSections.length}</h2>
              </div>
            </div>
          </div>

          {filteredSections.length === 0 ? (
            <div className="bg-white py-16 px-4 text-center rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto mt-8">
              <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FileText className="text-slate-400" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">No Sections Found</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto leading-relaxed">
                Get started by creating your first course section using the button above.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h2 className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                        {section.title}
                      </h2>
                      <span className="p-1.5 bg-slate-50 text-slate-400 rounded-lg shrink-0 border border-slate-100">
                        <BookOpen size={16} />
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{__html: section.description}}
                    />
                      {/* {section.description || (
                        <span className="italic text-slate-400">No description provided.</span>
                      )} */}
                    
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        Order: {section.orderNo ?? "—"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/ielts/course/${courseId}/section/${section.id}`)
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        onClick={() => setEditingSection(section)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteClick(section)}
                        className="inline-flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 rounded-xl transition-colors"
                        title="Delete section"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl relative shadow-xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setOpenAdd(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            <CreateSectionPage />
          </div>
        </div>
      )}

      {editingSection && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-2xl w-full max-w-2xl relative shadow-xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setEditingSection(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
            <EditSection
              section={editingSection}
              onClose={() => setEditingSection(null)}
            />
          </div>
        </div>
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
                <h3 className="text-lg font-semibold text-slate-900">Delete Section</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Are you sure you want to delete <span className="font-medium text-slate-700">"{deleteModal.section?.title}"</span>?
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