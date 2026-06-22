// import React, { useState } from "react";
// import { useParams, Link, useLocation } from "react-router-dom";
// import { 
//   Plus, 
//   ChevronRight, 
//   ArrowLeft, 
//   Layers, 
//   BookOpen, 
//   GripVertical, 
//   Trash2, 
//   Loader2,
//   AlertTriangle
// } from "lucide-react";
// import { useQueryClient } from "@tanstack/react-query";
// import { useAppMutation, useAppQuery } from "../../../lib/react-query";
// import { toast } from "react-toastify";

// interface Thumbnail {
//   id: string;
//   url: string;
//   key: string;
//   mimeType: string;
//   size: number;
//   type: string;
// }

// interface Language {
//   id: string;
//   name: string;
//   code: string;
//   isActive: boolean;
// }

// interface CourseSection {
//   id: string;
//   title: string;
//   description: string;
//   orderNo: number;
// }

// interface GenericEntity {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail?: Thumbnail;
//   language?: Language;
//   level: string;
//   isPublished?: boolean;
//   price?: string;
//   sections: CourseSection[];
// }

// export default function AddSection() {
//   // Use generic entityId instead of courseId
//   const { entityId } = useParams<{ entityId: string }>();
//   const { pathname } = useLocation();
//   const queryClient = useQueryClient();

//   // 1. DYNAMIC DETECTION HOOKS
//   const isIelts = pathname.includes("/ielts");
//   const entityTypeLabel = isIelts ? "IELTS Group" : "Course";
  
//   // Decide where to fetch from and what key to use based on URL
//   const fetchUrl = isIelts ? "/ielts" : "/courses";
//   const queryKey = isIelts ? ["ielts-list"] : ["courses"];
//   const returnHomeUrl = isIelts ? "/ielts" : "/courses/categories";

//   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
  
//   const [newSectionTitle, setNewSectionTitle] = useState<string>("");
//   const [newSectionDesc, setNewSectionDesc] = useState<string>("");
//   const [newSectionOrder, setNewSectionOrder] = useState<number>(1);

//   // FETCH GET ALL
//   const { data: entities = [], isLoading } = useAppQuery<GenericEntity[]>({
//     url: fetchUrl,
//     queryKey: queryKey,
//   });

//   const activeEntity = entities.find((e) => e.id === entityId);
//   const currentSections = activeEntity?.sections || [];

//   // MUTATION: POST NEW SECTION
//   const { mutate: createSection, isPending: isCreating } = useAppMutation({
//     url: "/sections",
//     type: "post",
//     onSuccess: () => {
//       toast.success(`${entityTypeLabel} section created successfully! 🎉`);
//       queryClient.invalidateQueries({ queryKey });
//       resetForm();
//     },
//     onError: (error) => {
//       console.error("Failed to save section:", error);
//       toast.error("An error occurred while creating the section.");
//     },
//   });

//   // MUTATION: DELETE SECTION
//   const { mutate: deleteSection } = useAppMutation({
//     url: deletingId ? `/sections/${deletingId}` : "/sections", 
//     type: "delete",
//     onSuccess: () => {
//       toast.success("Section removed successfully!");
//       queryClient.invalidateQueries({ queryKey });
//       setDeletingId(null);
//       setDeleteConfirmId(null);
//     },
//     onError: (error) => {
//       console.error("Failed to delete section:", error);
//       toast.error("Could not complete the removal request.");
//       setDeletingId(null);
//       setDeleteConfirmId(null);
//     },
//   });

//   const resetForm = () => {
//     setNewSectionTitle("");
//     setNewSectionDesc("");
//     setNewSectionOrder(1);
//     setIsModalOpen(false);
//   };

//   const handleCreateSection = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!newSectionTitle.trim()) return;

//     // 2. DYNAMIC APIS PAYLOAD
//     // Creates { course: id, courseId: id } or { ielts: id, ieltsId: id } on the fly
//     const dynamicKey = isIelts ? "ielts" : "course";
//     const dynamicIdKey = isIelts ? "ieltsId" : "courseId";

//     createSection({
//       data: {
//         [dynamicKey]: entityId,
//         [dynamicIdKey]: entityId,
//         title: newSectionTitle,
//         description: newSectionDesc,
//         orderNo: Number(newSectionOrder)
//       }
//     });
//   };

//   const executeDeleteSection = (): void => {
//     if (!deleteConfirmId) return;
//     setDeletingId(deleteConfirmId);
    
//     setTimeout(() => {
//       deleteSection({});
//     }, 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/40 gap-3">
//         <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
//         <p className="text-sm font-medium text-slate-500">Synchronizing {entityTypeLabel} Blueprint...</p>
//       </div>
//     );
//   }

//   if (!activeEntity) {
//     return (
//       <div className="p-8 max-w-5xl mx-auto space-y-4 text-center">
//         <h3 className="text-lg font-bold text-slate-800">Target Syllabus Matrix Missing</h3>
//         <p className="text-sm text-slate-500">Could not resolve a valid item matching target ID.</p>
//         <Link to={returnHomeUrl} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
//           <ArrowLeft className="w-4 h-4" /> Go Back
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/40 min-h-screen font-sans antialiased">
      
//       <div className="flex items-center gap-3">
//         <Link 
//           to={returnHomeUrl} 
//           className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors shadow-sm"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         </Link>
//         <div>
//           <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{entityTypeLabel} Syllabus Studio</span>
//           <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
//             {activeEntity.title}
//           </h1>
//         </div>
//       </div>

//       {/* DASHBOARD META STRIP */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
//         <div className="flex items-center gap-3 p-2">
//           <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
//             <Layers className="w-5 h-5" />
//           </div>
//           <div>
//             <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sections</span>
//             <span className="text-sm font-bold text-slate-800">{currentSections.length} Module Axes</span>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-x border-slate-100">
//           <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
//             <BookOpen className="w-5 h-5" />
//           </div>
//           <div>
//             <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Level</span>
//             <span className="text-sm font-semibold text-slate-700">{activeEntity.level || "Not Evaluated"}</span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between sm:justify-end gap-3 p-2">
//           <button 
//             onClick={() => {
//               setNewSectionOrder(currentSections.length + 1); 
//               setIsModalOpen(true);
//             }}
//             className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-150"
//           >
//             <Plus className="w-4 h-4" /> Add New Section
//           </button>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <div className="flex items-center justify-between px-1">
//           <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Curriculum Blueprint Matrix</h2>
//           <span className="text-xs text-slate-400">Order execution enabled</span>
//         </div>

//         {currentSections.length === 0 ? (
//           <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
//             <div className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mx-auto">
//               <Layers className="w-5 h-5" />
//             </div>
//             <h3 className="text-sm font-bold text-slate-800">No Syllabus Sections Evaluated</h3>
//             <button 
//               onClick={() => setIsModalOpen(true)}
//               className="mt-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
//             >
//               Initialize First Section
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {currentSections.map((section) => (
//               <div 
//                 key={section.id} 
//                 className="group bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all"
//               >
//                 <div className="flex items-center justify-between gap-4">
//                   <div className="flex items-center gap-3 flex-1 min-w-0">
//                     <div className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors hidden sm:block">
//                       <GripVertical className="w-4 h-4" />
//                     </div>
//                     <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
//                       {section.orderNo}
//                     </div>
//                     <div className="truncate">
//                       <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
//                         {section.title}
//                       </h3>
//                       <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
//                         {section.description || "No description evaluation mapped."}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 shrink-0">
//                     <button 
//                       onClick={() => setDeleteConfirmId(section.id)}
//                       className="p-2 rounded-lg bg-red-50/40 hover:bg-red-50 text-red-500 border border-red-100/40 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center"
//                     >
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
                    
//                     {/* DYNAMIC LESSON PATH NAVIGATION */}
//                     <Link 
//                       to={isIelts
//                         ? `/ielts/group/${entityId}/section/${section.id}`
//                         : `/courses/course/${entityId}/section/${section.id}`
//                       }
//                       className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 rounded-xl transition-all shadow-sm"
//                     >
//                       <Plus className="w-3.5 h-3.5" /> Add / View Lessons
//                       <ChevronRight className="w-3.5 h-3.5 opacity-60" />
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <form 
//             onSubmit={handleCreateSection}
//             className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
//           >
//             <div>
//               <h3 className="text-base font-bold text-slate-900">Add New Section Chapter</h3>
//               <p className="text-xs text-slate-400 mt-0.5">Configure your modular segment boundaries clearly.</p>
//             </div>

//             <div className="space-y-1">
//               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Section Title *</label>
//               <input 
//                 type="text"
//                 autoFocus
//                 required
//                 placeholder="e.g., Introduction"
//                 value={newSectionTitle}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSectionTitle(e.target.value)}
//                 className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400 bg-slate-50/50"
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Description</label>
//               <textarea 
//                 required
//                 placeholder="Detail the execution scope inside this section context..."
//                 value={newSectionDesc}
//                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewSectionDesc(e.target.value)}
//                 className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400 bg-slate-50/50 h-24 resize-none"
//               />
//             </div>

//             <div className="space-y-1">
//               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Order Number Sequence</label>
//               <input 
//                 type="number"
//                 required
//                 min={1}
//                 value={newSectionOrder}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSectionOrder(Number(e.target.value))}
//                 className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50/50"
//               />
//             </div>

//             <div className="flex justify-end gap-2 pt-2">
//               <button type="button" disabled={isCreating} onClick={resetForm} className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
//                 Cancel
//               </button>
//               <button type="submit" disabled={isCreating || !newSectionTitle.trim()} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center gap-1">
//                 {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create Module Section"}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {deleteConfirmId && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 text-center animate-in zoom-in-95 duration-150">
//             <div className="h-12 w-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto">
//               <AlertTriangle className="w-5 h-5" />
//             </div>
//             <div>
//               <h3 className="text-base font-bold text-slate-900">Delete Syllabus Section?</h3>
//               <p className="text-xs text-slate-400 mt-1 px-2">This action is permanent and will remove all inside lessons.</p>
//             </div>
//             <div className="flex justify-center gap-2 pt-1.5">
//               <button type="button" disabled={deletingId !== null} onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
//                 Cancel
//               </button>
//               <button type="button" disabled={deletingId !== null} onClick={executeDeleteSection} className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center gap-1">
//                 {deletingId !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes, Delete Section"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }




import React, { useState, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { 
  Plus, 
  ChevronRight, 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  GripVertical, 
  Trash2, 
  Loader2,
  AlertTriangle,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation, useAppQuery } from "../../../lib/react-query";
import { toast } from "react-toastify";
import EditCourseModal from "./editcourseModal"; 

interface Thumbnail {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  size: number;
  type: string;
}

interface Language {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
}

interface CourseSection {
  id: string;
  title: string;
  description: string;
  orderNo: number;
}

interface GenericEntity {
  id: string | number;
  title: string;
  description: string;
  thumbnail?: Thumbnail;
  language?: Language;
  level: string;
  isPublished?: boolean;
  price?: string;
  sections: CourseSection[];
}

function findArrayInObject(obj: any): any[] | null {
  if (!obj || typeof obj !== "object") return null;
  if (Array.isArray(obj)) return obj;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") {
        const nestedResult = findArrayInObject(value);
        if (nestedResult) return nestedResult;
      }
    }
  }
  return null;
}

export default function AddCourseSection() {
  const params = useParams();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const currentId = useMemo(() => {
    const values = Object.values(params);
    return values.length > 0 ? values[0] : undefined;
  }, [params]);

  const isIelts = pathname.includes("/ielts");
  const entityTypeLabel = isIelts ? "IELTS Group" : "Course";
  
  const fetchUrl = isIelts ? "/ielts" : "/courses";
  const queryKey = isIelts ? ["ielts-list"] : ["courses"];
  const returnHomeUrl = isIelts ? "/ielts" : "/courses/categories";

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [newSectionTitle, setNewSectionTitle] = useState<string>("");
  const [newSectionDesc, setNewSectionDesc] = useState<string>("");
  const [newSectionOrder, setNewSectionOrder] = useState<number>(1);

  const { data: serverResponse, isLoading } = useAppQuery<any>({
    url: fetchUrl,
    queryKey: queryKey,
  });

  const entities: GenericEntity[] = useMemo(() => {
    return findArrayInObject(serverResponse) || [];
  }, [serverResponse]);

  const activeEntity = entities.find((e) => String(e.id) === String(currentId));
  const currentSections = activeEntity?.sections || [];

  // Mutations
  const { mutate: createSection, isPending: isCreating } = useAppMutation({
    url: "/sections",
    type: "post",
    onSuccess: () => {
      toast.success(`${entityTypeLabel} section created successfully! 🎉`);
      queryClient.invalidateQueries({ queryKey });
      resetForm();
    },
    onError: (error) => {
      console.error("Failed to save section:", error);
      toast.error("An error occurred while creating the section.");
    },
  });

  const { mutate: deleteSection } = useAppMutation({
    url: deletingId ? `/sections/${deletingId}` : "/sections", 
    type: "delete",
    onSuccess: () => {
      toast.success("Section removed successfully!");
      queryClient.invalidateQueries({ queryKey });
      setDeletingId(null);
      setDeleteConfirmId(null);
    },
    onError: (error) => {
      console.error("Failed to delete section:", error);
      toast.error("Could not complete the removal request.");
      setDeletingId(null);
      setDeleteConfirmId(null);
    },
  });

  const resetForm = () => {
    setNewSectionTitle("");
    setNewSectionDesc("");
    setNewSectionOrder(1);
    setIsModalOpen(false);
  };

  const handleCreateSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const dynamicKey = isIelts ? "ielts" : "course";
    const dynamicIdKey = isIelts ? "ieltsId" : "courseId";

    createSection({
      data: {
        [dynamicKey]: currentId,
        [dynamicIdKey]: currentId,
        title: newSectionTitle,
        description: newSectionDesc,
        orderNo: Number(newSectionOrder)
      }
    });
  };

  const executeDeleteSection = (): void => {
    if (!deleteConfirmId) return;
    setDeletingId(deleteConfirmId);
    
    setTimeout(() => {
      deleteSection({});
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/40 gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Synchronizing {entityTypeLabel} Blueprint...</p>
      </div>
    );
  }

  if (!activeEntity) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Target Syllabus Matrix Missing</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Could not resolve a valid data node matching the ID <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-xs">{currentId || "undefined"}</span>.
          </p>
        </div>
        <Link to={returnHomeUrl} className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" /> Go Back to Studio Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/40 min-h-screen font-sans antialiased">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            to={returnHomeUrl} 
            className="p-2 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{entityTypeLabel} Syllabus Studio</span>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {activeEntity.title}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          Edit {entityTypeLabel} Settings
        </button>
      </div>

      {/* METRIC STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 p-2">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Sections</span>
            <span className="text-sm font-bold text-slate-800">{currentSections.length} Modules</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-100">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Level</span>
            <span className="text-sm font-semibold text-slate-700">{activeEntity.level || "Not Evaluated"}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-100">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            {activeEntity.isPublished ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status Metrics</span>
            <span className="text-sm font-semibold text-slate-700">
              {activeEntity.isPublished ? "Live / Published" : "Draft Mode"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 p-2 border-t sm:border-t-0 sm:border-l border-slate-100">
          <button 
            onClick={() => {
              setNewSectionOrder(currentSections.length + 1); 
              setIsModalOpen(true);
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-all duration-150"
          >
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
      </div>

      {/* SYLLABUS LIST TRACK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Curriculum Blueprint Matrix</h2>
          <span className="text-xs text-slate-400">Sequence layout configuration active</span>
        </div>

        {currentSections.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
            <div className="h-12 w-12 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 mx-auto">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Syllabus Sections Evaluated</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors border border-slate-200"
            >
              Initialize First Section
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentSections.map((section) => (
              <div 
                key={section.id} 
                className="group bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-slate-300 group-hover:text-slate-400 cursor-grab active:cursor-grabbing transition-colors hidden sm:block">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {section.orderNo}
                    </div>
                    <div className="truncate">
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {section.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {section.description || "No description evaluation mapped."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => setDeleteConfirmId(section.id)}
                      className="p-2 rounded-lg bg-red-50/40 hover:bg-red-50 text-red-500 border border-red-100/40 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <Link 
                      to={isIelts
                        ? `/ielts/group/${currentId}/section/${section.id}`
                        : `/courses/course/${currentId}/section/${section.id}`
                      }
                      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-600 rounded-xl transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" /> Lessons
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COURSE CONFIGURATION OVERLAY MODAL */}
      {isEditModalOpen && (
        <EditCourseModal
          entity={{
            ...activeEntity,
            id: String(activeEntity.id)
          } as any}
          isIelts={isIelts}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* CREATE DIALOG MODAL WINDOW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={handleCreateSection}
            className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Section Chapter</h3>
              <p className="text-xs text-slate-400 mt-0.5">Configure your modular segment boundaries clearly.</p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Section Title *</label>
              <input 
                type="text"
                autoFocus
                required
                placeholder="e.g., Introduction"
                value={newSectionTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSectionTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Description</label>
              <textarea 
                required
                placeholder="Detail the execution scope inside this section context..."
                value={newSectionDesc}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewSectionDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 placeholder-slate-400 bg-slate-50/50 h-24 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Order Number Sequence</label>
              <input 
                type="number"
                required
                min={1}
                value={newSectionOrder}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSectionOrder(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 bg-slate-50/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" disabled={isCreating} onClick={resetForm} className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isCreating || !newSectionTitle.trim()} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center gap-1">
                {isCreating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Create Module Section"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SYLLABUS DISMISSAL VERIFICATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="h-12 w-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Syllabus Section?</h3>
              <p className="text-xs text-slate-400 mt-1 px-2">This action is permanent and will remove all inside lessons.</p>
            </div>
            <div className="flex justify-center gap-2 pt-1.5">
              <button type="button" disabled={deletingId !== null} onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button type="button" disabled={deletingId !== null} onClick={executeDeleteSection} className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm transition-colors flex items-center gap-1">
                {deletingId !== null ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Yes, Delete Section"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


