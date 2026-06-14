// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { Plus, Eye, Pencil, Trash2, BookOpen, Layers, X, ArrowLeft, FileText } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useIELTSStore } from "../../../store/ielts.store";
// import { sectionSchema } from "../../../schema/section.schema";
// import type { SectionFormData } from "../../../schema/section.schema";

// export default function AddSectionPage() {
//   const navigate = useNavigate();
//   const { courseId } = useParams();

//   const { courses, updateCourse } = useIELTSStore();

//   const course = courses.find((c) => c.id === courseId);

//   const [open, setOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [initialFormValues, setInitialFormValues] = useState<SectionFormData>({
//     title: "",
//     description: "",
//     orderNo: 0,
//     ielts: null,
//   });

//   const handleEdit = (id: string, title: string, description: string = "", orderNo: number = 0, ielts: string | null = null) => {
//     setInitialFormValues({
//       title,
//       description,
//       orderNo,
//       ielts,
//     });
//     setEditingId(id);
//     setOpen(true);
//   };

//   const handleDelete = (sectionId: string) => {
//     if (!course) return;
//     if (window.confirm("Are you sure you want to delete this section?")) {
//       updateCourse(course.id!, {
//         ...course,
//         sections: (course.sections || []).filter((s) => s.id !== sectionId),
//       });
//     }
//   };

//   if (!course) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50 p-4">
//         <div className="text-center max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-gray-100 backdrop-blur-sm">
//           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-inner">
//             📚
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Course not found</h2>
//           <p className="text-gray-500 text-sm mt-2 mb-6">The course page you are looking for does not exist or has been removed.</p>
//           <button
//             onClick={() => navigate("/ielts/courses")}
//             className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-600/10"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50/50 antialiased">
//       {/* Navigation Bar Header */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
//         <button
//           onClick={() => navigate(`/ielts`)}
//           className="group inline-flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors duration-200 cursor-pointer"
//         >
//           <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
//           Back to Dashboard
//         </button>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Header Section */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 transition-all duration-200 hover:shadow-md/50">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
//             <div className="flex items-start sm:items-center gap-4">
//               <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/50 flex-shrink-0">
//                 <BookOpen className="w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{course.title}</h1>
//                 <div className="flex items-center gap-2 mt-1.5 text-gray-500">
//                   <Layers className="w-4 h-4 text-gray-400" />
//                   <span className="text-sm font-semibold text-gray-600">
//                     {course.sections?.length || 0} {(course.sections?.length || 0) === 1 ? 'Section' : 'Sections'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 setEditingId(null);
//                 setInitialFormValues({
//                   title: "",
//                   description: "",
//                   orderNo: 0,
//                   ielts: null,
//                 });
//                 setOpen(true);
//               }}
//               className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/10 active:scale-[0.98]"
//             >
//               <Plus className="w-4 h-4 stroke-[2.5]" />
//               Add Section
//             </button>
//           </div>
//         </div>

//         {/* Sections Grid */}
//         {!course.sections || course.sections.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center max-w-xl mx-auto my-12">
//             <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
//               📖
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-1">No sections yet</h3>
//             <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Start structuring your curriculum by adding your first educational segment layout.</p>
//             <button
//               onClick={() => {
//                 setEditingId(null);
//                 setInitialFormValues({
//                   title: "",
//                   description: "",
//                   orderNo: 0,
//                   ielts: null,
//                 });
//                 setOpen(true);
//               }}
//               className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition active:scale-[0.98]"
//             >
//               <Plus className="w-4 h-4" />
//               Create First Section
//             </button>
//           </div>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {course.sections.map((section) => (
//               <div
//                 key={section.id}
//                 className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200/80 transition-all duration-300 flex flex-col justify-between"
//               >
//                 <div className="p-6">
//                   <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100 mb-4">
//                     <Layers className="w-3 h-3" /> Section
//                   </span>
//                   <h3 className="text-lg font-bold text-gray-800 tracking-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">
//                     {section.title}
//                   </h3>
                  
//                   {/* Display Description if exists */}
//                   {section.description && (
//                     <p className="text-sm text-gray-500 line-clamp-2 mb-3">
//                       {section.description}
//                     </p>
//                   )}
                  
//                   <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
//                     <BookOpen className="w-4 h-4 text-gray-300" />
//                     <span>{section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? 'Lesson' : 'Lessons'}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center divide-x divide-gray-100 border-t border-gray-100 bg-slate-50/50 rounded-b-2xl overflow-hidden">
//                   <button
//                     onClick={() => navigate(`/ielts/course/${course.id}/section/${section.id}`)}
//                     className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-white transition duration-200"
//                   >
//                     <Eye className="w-4 h-4" />
//                     View
//                   </button>

//                   <button
//                     onClick={() => handleEdit(section.id!, section.title, section.description || "", section.orderNo, section.ielts || null)}
//                     className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-white transition duration-200"
//                   >
//                     <Pencil className="w-4 h-4" />
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleDelete(section.id!)}
//                     className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-white transition duration-200"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal Overlay Setup */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
//           {/* Backdrop Blur effect wrapper */}
//           <div 
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
//             onClick={() => {
//               setOpen(false);
//               setEditingId(null);
//             }}
//           />

//           {/* Modal Container Content */}
//           <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-300 ease-out z-10 my-auto overflow-hidden">
//             <Formik
//               enableReinitialize
//               initialValues={initialFormValues}
//               validationSchema={sectionSchema}
//               onSubmit={(values, { resetForm }) => {
//                 if (!course) return;

//                 let updatedSections = course.sections || [];

//                 if (editingId) {
//                   updatedSections = updatedSections.map((section) =>
//                     section.id === editingId 
//                       ? { ...section, ...values } 
//                       : section
//                   );
//                 } else {
//                   updatedSections.push({
//                     id: Date.now().toString(),
//                     ...values,
//                     lessons: [],
//                   });
//                 }

//                 updateCourse(course.id!, {
//                   ...course,
//                   sections: updatedSections,
//                 });

//                 resetForm();
//                 setOpen(false);
//                 setEditingId(null);
//               }}
//             >
//               {({ isSubmitting, handleSubmit }) => (
//                 <Form>
//                   <div className="px-6 pt-6 pb-4">
//                     <div className="flex justify-between items-start mb-6">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900 tracking-tight">
//                           {editingId ? "Edit Section" : "Add New Section"}
//                         </h3>
//                         <p className="text-sm text-gray-400 mt-1">
//                           {editingId ? "Modify details for this section curriculum." : "Organize your structure cleanly with standard parameters."}
//                         </p>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setOpen(false);
//                           setEditingId(null);
//                         }}
//                         className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//                       >
//                         <X className="w-5 h-5" />
//                       </button>
//                     </div>

//                     <div className="space-y-6">
//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Section Title <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                           name="title"
//                           type="text"
//                           placeholder="e.g., Reading Masterclass, Introduction"
//                           className="w-full px-4 py-2.5 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
//                           autoFocus
//                         />
//                         <ErrorMessage name="title">
//                           {(msg) => (
//                             <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50">
//                               <span className="text-xs">⚠️</span> 
//                               <span className="font-medium">{msg}</span>
//                             </div>
//                           )}
//                         </ErrorMessage>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           Order Number
//                         </label>
//                         <Field
//                           name="orderNo"
//                           type="number"
//                           placeholder="0"
//                           className="w-full px-4 py-2.5 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
//                         />
//                         <ErrorMessage name="orderNo">
//                           {(msg) => (
//                             <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50">
//                               <span className="text-xs">⚠️</span> 
//                               <span className="font-medium">{msg}</span>
//                             </div>
//                           )}
//                         </ErrorMessage>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           IELTS Type (Optional)
//                         </label>
//                         <Field
//                           name="ielts"
//                           as="select"
//                           className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition duration-200"
//                         >
//                           <option value="">None</option>
//                           <option value="Academic">Academic</option>
//                           <option value="General">General Training</option>
//                           <option value="UKVI">UKVI</option>
//                         </Field>
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           <FileText className="w-4 h-4 inline mr-1.5 text-gray-400" />
//                           Description
//                         </label>
//                         <Field
//                           name="description"
//                           as="textarea"
//                           placeholder="Provide a brief overview of what this section covers..."
//                           rows={4}
//                           className="w-full px-4 py-2.5 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition duration-200 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
//                         />
//                         <ErrorMessage name="description">
//                           {(msg) => (
//                             <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50">
//                               <span className="text-xs">⚠️</span> 
//                               <span className="font-medium">{msg}</span>
//                             </div>
//                           )}
//                         </ErrorMessage>
//                       </div>

//                       <div className="flex gap-3 pt-2">
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setOpen(false);
//                             setEditingId(null);
//                           }}
//                           className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-800 transition active:scale-[0.98]"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           type="submit"
//                           disabled={isSubmitting}
//                           className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-600/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {isSubmitting ? "Saving..." : (editingId ? "Update Section" : "Create Section")}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </Form>
//               )}
//             </Formik>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Plus, Eye, Pencil, Trash2, BookOpen, Layers, X, ArrowLeft, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sectionSchema } from "../../../schema/section.schema";
import type { SectionFormData } from "../../../schema/section.schema";
import { useAppQuery, useAppMutation } from "../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface Section {
  id?: string;
  ielts?: string | null;
  title: string;
  description: string;
  orderNo: number;
  lessons?: any[];
}

export default function AddSectionPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<SectionFormData>({
    title: "",
    description: "",
    orderNo: 0,
    ielts: null,
  });

  // =========================
  // FETCH SECTIONS
  // =========================
  const { data: sections = [], isLoading: sectionsLoading } = useAppQuery<Section[]>({
    url: "/sections",
    queryKey: ["sections"],
  });

  // =========================
  // CREATE SECTION
  // =========================
  const { mutate: createSection, isPending: isCreating } = useAppMutation({
    url: "/sections",
    type: "post",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setOpen(false);
      setEditingId(null);
    },
  });

  // =========================
  // UPDATE SECTION
  // =========================
  const { mutate: updateSection, isPending: isUpdating } = useAppMutation({
    url: "/sections",
    type: "put",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      setOpen(false);
      setEditingId(null);
    },
  });

  // =========================
  // DELETE SECTION
  // =========================
  const { mutate: deleteSection, isPending: isDeleting } = useAppMutation({
    url: "/sections",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });

  const handleEdit = (id: string, title: string, description: string = "", orderNo: number = 0, ielts: string | null = null) => {
    setInitialFormValues({
      title,
      description,
      orderNo,
      ielts,
    });
    setEditingId(id);
    setOpen(true);
  };

  const handleDelete = (sectionId: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      deleteSection({ id: sectionId });
    }
  };

  const handleSubmit = (values: SectionFormData) => {
    const payload = {
      ielts: values.ielts || null,
      title: values.title,
      description: values.description || "",
      orderNo: values.orderNo,
    };

    if (editingId) {
      updateSection({ 
        id: editingId, 
        data: payload 
      });
    } else {
      createSection({ data: payload });
    }
  };

  if (sectionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 antialiased">
      {/* Navigation Bar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(`/ielts`)}
          className="group inline-flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-blue-600 transition-colors duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 transition-all duration-200 hover:shadow-md/50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100/50 flex-shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Sections Management
                </h1>
                <div className="flex items-center gap-2 mt-1.5 text-gray-500">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600">
                    {sections?.length || 0} {(sections?.length || 0) === 1 ? 'Section' : 'Sections'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setInitialFormValues({
                  title: "",
                  description: "",
                  orderNo: sections?.length || 0,
                  ielts: null,
                });
                setOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm shadow-blue-600/10 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Section
            </button>
          </div>
        </div>

        {/* Sections Grid */}
        {!sections || sections.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              📖
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">No sections yet</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Start structuring your curriculum by adding your first educational segment layout.</p>
            <button
              onClick={() => {
                setEditingId(null);
                setInitialFormValues({
                  title: "",
                  description: "",
                  orderNo: sections?.length || 0,
                  ielts: null,
                });
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              Create First Section
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-100 mb-4">
                    <Layers className="w-3 h-3" /> Section {section.orderNo !== undefined && `· #${section.orderNo}`}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 tracking-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {section.title}
                  </h3>
                  
                  {section.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {section.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
                    <BookOpen className="w-4 h-4 text-gray-300" />
                    <span>{section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? 'Lesson' : 'Lessons'}</span>
                  </div>
                </div>

                <div className="flex items-center divide-x divide-gray-100 border-t border-gray-100 bg-slate-50/50 rounded-b-2xl overflow-hidden">
                  <button
                    onClick={() => navigate(`/ielts/section/${section.id}`)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-white transition duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>

                  <button
                    onClick={() => handleEdit(section.id!, section.title, section.description || "", section.orderNo, section.ielts || null)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-white transition duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(section.id!)}
                    disabled={isDeleting}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-white transition duration-200 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Overlay Setup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => {
              setOpen(false);
              setEditingId(null);
            }}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-300 ease-out z-10 my-auto overflow-hidden">
            <Formik
              enableReinitialize
              initialValues={initialFormValues}
              validationSchema={sectionSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, handleSubmit }) => (
                <Form>
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                          {editingId ? "Edit Section" : "Add New Section"}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {editingId ? "Modify details for this section curriculum." : "Organize your structure cleanly with standard parameters."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          setEditingId(null);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Section Title <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="title"
                          type="text"
                          placeholder="e.g., Reading Masterclass, Introduction"
                          className="w-full px-4 py-2.5 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
                          autoFocus
                        />
                        <ErrorMessage name="title">
                          {(msg) => (
                            <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50">
                              <span className="text-xs">⚠️</span> 
                              <span className="font-medium">{msg}</span>
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Order Number
                        </label>
                        <Field
                          name="orderNo"
                          type="number"
                          placeholder="0"
                          className="w-full px-4 py-2.5 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition duration-200 border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
                        />
                        <ErrorMessage name="orderNo">
                          {(msg) => (
                            <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50">
                              <span className="text-xs">⚠️</span> 
                              <span className="font-medium">{msg}</span>
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          IELTS Type (Optional)
                        </label>
                        <Field
                          name="ielts"
                          as="select"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition duration-200"
                        >
                          <option value="">None</option>
                          <option value="Academic">Academic</option>
                          <option value="General">General Training</option>
                          <option value="UKVI">UKVI</option>
                        </Field>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FileText className="w-4 h-4 inline mr-1.5 text-gray-400" />
                          Description
                        </label>
                        <Field
                          name="description"
                          as="textarea"
                          placeholder="Provide a brief overview of what this section covers..."
                          rows={4}
                          className="w-full px-4 py-2.5 border rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition duration-200 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
                        />
                        <ErrorMessage name="description">
                          {(msg) => (
                            <div className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50/50 px-3 py-1.5 rounded-lg border border-red-100/50">
                              <span className="text-xs">⚠️</span> 
                              <span className="font-medium">{msg}</span>
                            </div>
                          )}
                        </ErrorMessage>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setEditingId(null);
                          }}
                          className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-800 transition active:scale-[0.98]"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || isCreating || isUpdating}
                          className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm shadow-blue-600/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting || isCreating || isUpdating 
                            ? "Saving..." 
                            : (editingId ? "Update Section" : "Create Section")
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}