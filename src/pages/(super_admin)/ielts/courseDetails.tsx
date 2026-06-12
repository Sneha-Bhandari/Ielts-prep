// // import React, { useState } from "react";
// // import { ArrowLeft, Plus, Eye, Pencil, Trash2, X, Video, Clock, BookOpen, Link2, Hash } from "lucide-react";
// // import { useNavigate, useParams } from "react-router-dom";

// // interface Lesson {
// //   id?: number;
// //   section: string;
// //   title: string;
// //   content: string;
// //   video_url: string;
// //   video_url_key: string;
// //   duration: number;
// //   order_no: number;
// // }

// // export default function CourseDetails() {
// //   const navigate = useNavigate();
// //   const { id } = useParams();

// //   // Later replace with API data
// //   const course = {
// //     id,
// //     title: "IELTS Academic Course",
// //     type: "Academic",
// //     description: "Comprehensive IELTS Academic preparation course covering all four modules: Listening, Reading, Writing, and Speaking.",
// //   };

// //   const [lessons, setLessons] = useState<Lesson[]>([]);
// //   const [showLessonModal, setShowLessonModal] = useState(false);
// //   const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

// //   const [lessonForm, setLessonForm] = useState<Lesson>({
// //     section: "",
// //     title: "",
// //     content: "",
// //     video_url: "",
// //     video_url_key: "",
// //     duration: 0,
// //     order_no: 1,
// //   });

// //   const resetLessonForm = () => {
// //     setLessonForm({
// //       section: "",
// //       title: "",
// //       content: "",
// //       video_url: "",
// //       video_url_key: "",
// //       duration: 0,
// //       order_no: lessons.length + 1,
// //     });
// //     setEditingLesson(null);
// //   };

// //   const handleLessonSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (editingLesson) {
// //       // Update existing lesson
// //       setLessons((prev) =>
// //         prev.map((lesson) =>
// //           lesson.id === editingLesson.id ? { ...lessonForm, id: editingLesson.id } : lesson
// //         )
// //       );
// //     } else {
// //       // Add new lesson
// //       const newLesson: Lesson = {
// //         id: Date.now(),
// //         ...lessonForm,
// //       };
// //       setLessons((prev) => [...prev, newLesson]);
// //     }

// //     resetLessonForm();
// //     setShowLessonModal(false);
// //   };

// //   const handleEditLesson = (lesson: Lesson) => {
// //     setEditingLesson(lesson);
// //     setLessonForm(lesson);
// //     setShowLessonModal(true);
// //   };

// //   const handleDeleteLesson = (id?: number) => {
// //     if (!id) return;
// //     if (window.confirm("Are you sure you want to delete this lesson?")) {
// //       setLessons((prev) => prev.filter((lesson) => lesson.id !== id));
// //     }
// //   };

// //   const handleViewLesson = (lesson: Lesson) => {
// //     // Implement view lesson functionality
// //     alert(`Viewing lesson: ${lesson.title}\n\nContent: ${lesson.content}\n\nVideo: ${lesson.video_url || 'No video'}`);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
// //         {/* Header Section */}
// //         <div className="mb-8">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
// //           >
// //             <ArrowLeft size={18} />
// //             <span className="text-sm font-medium">Back to Dashboard</span>
// //           </button>

// //           <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
// //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //               <div className="flex-1">
// //                 <div className="flex items-center gap-3 mb-3">
// //                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
// //                     {course.type}
// //                   </span>
// //                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
// //                     {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
// //                   </span>
// //                 </div>
// //                 <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
// //                   {course.title}
// //                 </h1>
// //                 <p className="text-gray-600 text-sm sm:text-base">
// //                   {course.description}
// //                 </p>
// //               </div>
// //               <button
// //                 onClick={() => setShowLessonModal(true)}
// //                 className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
// //               >
// //                 <Plus size={18} />
// //                 Add New Lesson
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Lessons Section */}
// //         <div>
// //           <div className="mb-4">
// //             <h2 className="text-lg font-semibold text-gray-900">Course Curriculum</h2>
// //             <p className="text-sm text-gray-500 mt-1">Manage and organize your lesson content</p>
// //           </div>

// //           {lessons.length === 0 ? (
// //             <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
// //               <div className="text-center py-12 px-4">
// //                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
// //                   <BookOpen className="w-8 h-8 text-gray-400" />
// //                 </div>
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
// //                 <p className="text-gray-500 mb-4">Get started by adding your first lesson to this course.</p>
// //                 <button
// //                   onClick={() => setShowLessonModal(true)}
// //                   className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
// //                 >
// //                   <Plus size={16} />
// //                   Add First Lesson
// //                 </button>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
// //               <div className="overflow-x-auto">
// //                 <table className="min-w-full divide-y divide-gray-200">
// //                   <thead className="bg-gray-50">
// //                     <tr>
// //                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         #
// //                       </th>
// //                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Section
// //                       </th>
// //                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Lesson Title
// //                       </th>
// //                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Duration
// //                       </th>
// //                       <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Video
// //                       </th>
// //                       <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                         Actions
// //                       </th>
// //                     </tr>
// //                   </thead>
// //                   <tbody className="bg-white divide-y divide-gray-200">
// //                     {lessons
// //                       .sort((a, b) => a.order_no - b.order_no)
// //                       .map((lesson) => (
// //                         <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
// //                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
// //                             {lesson.order_no}
// //                           </td>
// //                           <td className="px-4 py-4 whitespace-nowrap">
// //                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
// //                               {lesson.section}
// //                             </span>
// //                           </td>
// //                           <td className="px-4 py-4">
// //                             <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
// //                             {lesson.content && (
// //                               <div className="text-xs text-gray-500 mt-1 line-clamp-1">{lesson.content}</div>
// //                             )}
// //                           </td>
// //                           <td className="px-4 py-4 whitespace-nowrap">
// //                             {lesson.duration > 0 ? (
// //                               <div className="flex items-center gap-1 text-sm text-gray-600">
// //                                 <Clock size={14} />
// //                                 <span>{lesson.duration} min</span>
// //                               </div>
// //                             ) : (
// //                               <span className="text-sm text-gray-400">-</span>
// //                             )}
// //                           </td>
// //                           <td className="px-4 py-4 whitespace-nowrap">
// //                             {lesson.video_url ? (
// //                               <div className="flex items-center gap-1 text-sm text-green-600">
// //                                 <Video size={14} />
// //                                 <span>Available</span>
// //                               </div>
// //                             ) : (
// //                               <span className="text-sm text-gray-400">No video</span>
// //                             )}
// //                           </td>
// //                           <td className="px-4 py-4 whitespace-nowrap text-right">
// //                             <div className="flex items-center justify-end gap-2">
// //                               <button
// //                                 onClick={() => handleViewLesson(lesson)}
// //                                 className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors"
// //                                 title="View Lesson"
// //                               >
// //                                 <Eye size={16} />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleEditLesson(lesson)}
// //                                 className="p-1.5 text-gray-600 hover:text-amber-600 transition-colors"
// //                                 title="Edit Lesson"
// //                               >
// //                                 <Pencil size={16} />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleDeleteLesson(lesson.id)}
// //                                 className="p-1.5 text-gray-600 hover:text-red-600 transition-colors"
// //                                 title="Delete Lesson"
// //                               >
// //                                 <Trash2 size={16} />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>

// //       {/* Add/Edit Lesson Modal */}
// //       {showLessonModal && (
// //         <div
// //           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
// //           onClick={() => {
// //             setShowLessonModal(false);
// //             resetLessonForm();
// //           }}
// //         >
// //           <div
// //             className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
// //             onClick={(e) => e.stopPropagation()}
// //           >
// //             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
// //               <h2 className="text-xl font-semibold text-gray-900">
// //                 {editingLesson ? "Edit Lesson" : "Add New Lesson"}
// //               </h2>
// //               <button
// //                 onClick={() => {
// //                   setShowLessonModal(false);
// //                   resetLessonForm();
// //                 }}
// //                 className="text-gray-400 hover:text-gray-600 transition-colors"
// //               >
// //                 <X size={20} />
// //               </button>
// //             </div>

// //             <form onSubmit={handleLessonSubmit} className="p-6 space-y-5">
// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Section <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={lessonForm.section}
// //                     onChange={(e) =>
// //                       setLessonForm({ ...lessonForm, section: e.target.value })
// //                     }
// //                     placeholder="e.g., Introduction, Module 1"
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Order Number <span className="text-red-500">*</span>
// //                   </label>
// //                   <input
// //                     type="number"
// //                     min="1"
// //                     value={lessonForm.order_no}
// //                     onChange={(e) =>
// //                       setLessonForm({ ...lessonForm, order_no: Number(e.target.value) })
// //                     }
// //                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Lesson Title <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   type="text"
// //                   value={lessonForm.title}
// //                   onChange={(e) =>
// //                     setLessonForm({ ...lessonForm, title: e.target.value })
// //                   }
// //                   placeholder="Enter lesson title"
// //                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   required
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Content
// //                 </label>
// //                 <textarea
// //                   rows={5}
// //                   value={lessonForm.content}
// //                   onChange={(e) =>
// //                     setLessonForm({ ...lessonForm, content: e.target.value })
// //                   }
// //                   placeholder="Write lesson content, instructions, or notes..."
// //                   className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Video URL
// //                   </label>
// //                   <div className="relative">
// //                     <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
// //                     <input
// //                       type="url"
// //                       value={lessonForm.video_url}
// //                       onChange={(e) =>
// //                         setLessonForm({ ...lessonForm, video_url: e.target.value })
// //                       }
// //                       placeholder="https://youtube.com/watch?v=..."
// //                       className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Video Key
// //                   </label>
// //                   <div className="relative">
// //                     <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
// //                     <input
// //                       type="text"
// //                       value={lessonForm.video_url_key}
// //                       onChange={(e) =>
// //                         setLessonForm({ ...lessonForm, video_url_key: e.target.value })
// //                       }
// //                       placeholder="Video identifier"
// //                       className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   </div>
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-1">
// //                   Duration (minutes)
// //                 </label>
// //                 <div className="relative">
// //                   <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
// //                   <input
// //                     type="number"
// //                     min="0"
// //                     value={lessonForm.duration}
// //                     onChange={(e) =>
// //                       setLessonForm({ ...lessonForm, duration: Number(e.target.value) })
// //                     }
// //                     placeholder="e.g., 15"
// //                     className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setShowLessonModal(false);
// //                     resetLessonForm();
// //                   }}
// //                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
// //                 >
// //                   {editingLesson ? "Update Lesson" : "Save Lesson"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import React, { useMemo, useState } from "react";
// import {
//   ArrowLeft,
//   Plus,
//   Eye,
//   Pencil,
//   Trash2,
//   X,
//   Video,
//   Clock,
//   BookOpen,
//   Link2,
//   Hash,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useIELTSStore } from "../../../store/ielts.store";
// // import { useIELTSStore } from "../../../store/ielts.store";

// interface Lesson {
//   id?: number;
//   section: string;
//   title: string;
//   content: string;
//   video_url: string;
//   video_url_key: string;
//   duration: number;
//   order_no: number;
// }

// export default function CourseDetails() {
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const { courses, updateCourse } = useIELTSStore();

//   // ✅ Get course from store
//   const course = useMemo(() => {
//     return courses.find((c) => String(c.id) === String(id));
//   }, [courses, id]);

//   const lessons: Lesson[] = course?.lessons || [];

//   const [showLessonModal, setShowLessonModal] = useState(false);
//   const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

//   const [lessonForm, setLessonForm] = useState<Lesson>({
//     section: "",
//     title: "",
//     content: "",
//     video_url: "",
//     video_url_key: "",
//     duration: 0,
//     order_no: lessons.length + 1,
//   });

//   // reset form
//   const resetLessonForm = () => {
//     setLessonForm({
//       section: "",
//       title: "",
//       content: "",
//       video_url: "",
//       video_url_key: "",
//       duration: 0,
//       order_no: lessons.length + 1,
//     });
//     setEditingLesson(null);
//   };

//   // sync lessons into zustand store
//   const syncLessons = (updatedLessons: Lesson[]) => {
//     if (!course) return;

//     updateCourse(course.id, {
//       ...course,
//       lessons: updatedLessons,
//     });
//   };

//   // submit add/edit lesson
//   const handleLessonSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!course) return;

//     let updatedLessons: Lesson[] = [...lessons];

//     if (editingLesson) {
//       updatedLessons = updatedLessons.map((lesson) =>
//         lesson.id === editingLesson.id
//           ? { ...lessonForm, id: editingLesson.id }
//           : lesson
//       );
//     } else {
//       const newLesson: Lesson = {
//         id: Date.now(),
//         ...lessonForm,
//       };
//       updatedLessons.push(newLesson);
//     }

//     syncLessons(updatedLessons);
//     resetLessonForm();
//     setShowLessonModal(false);
//   };

//   // edit lesson
//   const handleEditLesson = (lesson: Lesson) => {
//     setEditingLesson(lesson);
//     setLessonForm(lesson);
//     setShowLessonModal(true);
//   };

//   // delete lesson
//   const handleDeleteLesson = (id?: number) => {
//     if (!id || !course) return;

//     if (window.confirm("Are you sure you want to delete this lesson?")) {
//       const updatedLessons = lessons.filter((l) => l.id !== id);
//       syncLessons(updatedLessons);
//     }
//   };

//   // view lesson
//   const handleViewLesson = (lesson: Lesson) => {
//     alert(
//       `Viewing Lesson:\n\nTitle: ${lesson.title}\n\nContent: ${lesson.content}\n\nVideo: ${
//         lesson.video_url || "No video"
//       }`
//     );
//   };

//   if (!course) {
//     return (
//       <div className="p-6 text-red-500">
//         Course not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-600 mb-4"
//         >
//           <ArrowLeft size={18} />
//           Back
//         </button>

//         {/* Course Header */}
//         <div className="bg-white p-6 rounded-lg border shadow-sm">
//           <h1 className="text-2xl font-bold text-gray-900">
//             {course.title}
//           </h1>
//           <p className="text-gray-600 mt-1">{course.description}</p>

//           <div className="mt-2 text-sm text-gray-500">
//             {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
//           </div>

//           <button
//             onClick={() => setShowLessonModal(true)}
//             className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             <Plus size={16} />
//             Add Lesson
//           </button>
//         </div>

//         {/* Lessons Table */}
//         <div className="mt-6 bg-white border rounded-lg overflow-hidden">
//           {lessons.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               <BookOpen className="mx-auto mb-2" />
//               No lessons found. Start by adding one.
//             </div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-gray-100 text-left">
//                 <tr>
//                   <th className="p-3">#</th>
//                   <th>Section</th>
//                   <th>Title</th>
//                   <th>Duration</th>
//                   <th>Video</th>
//                   <th className="text-right p-3">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {lessons
//                   .sort((a, b) => a.order_no - b.order_no)
//                   .map((lesson) => (
//                     <tr key={lesson.id} className="border-t">
//                       <td className="p-3">{lesson.order_no}</td>

//                       <td>
//                         <span className="bg-gray-200 text-xs px-2 py-1 rounded">
//                           {lesson.section}
//                         </span>
//                       </td>

//                       <td>
//                         <div className="font-medium">{lesson.title}</div>
//                         <div className="text-xs text-gray-500 line-clamp-1">
//                           {lesson.content}
//                         </div>
//                       </td>

//                       <td>
//                         {lesson.duration ? (
//                           <div className="flex items-center gap-1 text-sm">
//                             <Clock size={14} />
//                             {lesson.duration} min
//                           </div>
//                         ) : (
//                           "-"
//                         )}
//                       </td>

//                       <td>
//                         {lesson.video_url ? (
//                           <span className="text-green-600 text-sm flex items-center gap-1">
//                             <Video size={14} />
//                             Available
//                           </span>
//                         ) : (
//                           <span className="text-gray-400 text-sm">
//                             No video
//                           </span>
//                         )}
//                       </td>

//                       <td className="p-3">
//                         <div className="flex justify-end gap-2">
//                           <button onClick={() => handleViewLesson(lesson)}>
//                             <Eye size={16} />
//                           </button>

//                           <button onClick={() => handleEditLesson(lesson)}>
//                             <Pencil size={16} />
//                           </button>

//                           <button onClick={() => handleDeleteLesson(lesson.id)}>
//                             <Trash2 size={16} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showLessonModal && (
//         <div
//           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
//           onClick={() => {
//             setShowLessonModal(false);
//             resetLessonForm();
//           }}
//         >
//           <div
//             className="bg-white w-full max-w-2xl rounded-lg p-6"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="flex justify-between mb-4">
//               <h2 className="text-lg font-semibold">
//                 {editingLesson ? "Edit Lesson" : "Add Lesson"}
//               </h2>

//               <button
//                 onClick={() => {
//                   setShowLessonModal(false);
//                   resetLessonForm();
//                 }}
//               >
//                 <X />
//               </button>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleLessonSubmit} className="space-y-3">

//               <input
//                 placeholder="Section"
//                 className="w-full border p-2"
//                 value={lessonForm.section}
//                 onChange={(e) =>
//                   setLessonForm({ ...lessonForm, section: e.target.value })
//                 }
//                 required
//               />

//               <input
//                 placeholder="Title"
//                 className="w-full border p-2"
//                 value={lessonForm.title}
//                 onChange={(e) =>
//                   setLessonForm({ ...lessonForm, title: e.target.value })
//                 }
//                 required
//               />

//               <textarea
//                 placeholder="Content"
//                 className="w-full border p-2"
//                 value={lessonForm.content}
//                 onChange={(e) =>
//                   setLessonForm({ ...lessonForm, content: e.target.value })
//                 }
//               />

//               <input
//                 type="number"
//                 placeholder="Duration (min)"
//                 className="w-full border p-2"
//                 value={lessonForm.duration}
//                 onChange={(e) =>
//                   setLessonForm({
//                     ...lessonForm,
//                     duration: Number(e.target.value),
//                   })
//                 }
//               />

//               <input
//                 placeholder="Video URL"
//                 className="w-full border p-2"
//                 value={lessonForm.video_url}
//                 onChange={(e) =>
//                   setLessonForm({
//                     ...lessonForm,
//                     video_url: e.target.value,
//                   })
//                 }
//               />

//               <div className="flex justify-end gap-2 pt-4">
//                 <button
//                   type="button"
//                   className="px-4 py-2 border"
//                   onClick={() => {
//                     setShowLessonModal(false);
//                     resetLessonForm();
//                   }}
//                 >
//                   Cancel
//                 </button>

//                 <button className="px-4 py-2 bg-blue-600 text-white">
//                   {editingLesson ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { ArrowLeft, Plus, Eye, Pencil, Trash2, X, Video, Clock, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useIELTSStore } from "../../../store/ielts.store";

interface Lesson {
  id?: number;
  section: string;
  title: string;
  content: string;
  video_url: string;
  video_url_key: string;
  duration: number;
  order_no: number;
}

const lessonValidationSchema = yup.object({
  section: yup.string().required("Section is required"),
  title: yup.string().required("Title is required"),
  content: yup.string(),
  video_url: yup.string().url("Must be a valid URL"),
  video_url_key: yup.string(),
  duration: yup.number().min(0, "Must be positive"),
  order_no: yup.number().required("Order number is required").min(1, "Must be at least 1"),
});

export default function CourseDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { courses, updateCourse } = useIELTSStore();

  const course = useMemo(() => {
    return courses.find((c) => String(c.id) === String(id));
  }, [courses, id]);

  const lessons: Lesson[] = course?.lessons || [];

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const formik = useFormik({
    initialValues: {
      section: "",
      title: "",
      content: "",
      video_url: "",
      video_url_key: "",
      duration: 0,
      order_no: lessons.length + 1,
    },
    validationSchema: lessonValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!course) return;

      let updatedLessons: Lesson[] = [...lessons];

      if (editingLesson) {
        updatedLessons = updatedLessons.map((lesson) =>
          lesson.id === editingLesson.id ? { ...values, id: editingLesson.id } : lesson
        );
      } else {
        const newLesson: Lesson = {
          id: Date.now(),
          ...values,
        };
        updatedLessons.push(newLesson);
      }

      updateCourse(course.id, { ...course, lessons: updatedLessons });
      setShowLessonModal(false);
      setEditingLesson(null);
      formik.resetForm();
    },
  });

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    formik.setValues(lesson);
    setShowLessonModal(true);
  };

  const handleDeleteLesson = (id?: number) => {
    if (!id || !course) return;
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const updatedLessons = lessons.filter((l) => l.id !== id);
      updateCourse(course.id, { ...course, lessons: updatedLessons });
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Course not found</p>
          <button
            onClick={() => navigate("/ielts")}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/ielts")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {course.type}
                  </span>
                  <span className="text-sm text-gray-500">
                    {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </div>
              <button
                onClick={() => {
                  setEditingLesson(null);
                  formik.resetForm();
                  setShowLessonModal(true);
                }}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Plus size={16} />
                Add Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Course Curriculum</h2>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">No lessons yet. Add your first lesson.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {lessons
                .sort((a, b) => a.order_no - b.order_no)
                .map((lesson) => (
                  <div key={lesson.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">#{lesson.order_no}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                            {lesson.section}
                          </span>
                          {lesson.duration > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                              <Clock size={12} />
                              {lesson.duration} min
                            </span>
                          )}
                          {lesson.video_url && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <Video size={12} />
                              Video
                            </span>
                          )}
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">{lesson.title}</h3>
                        {lesson.content && (
                          <p className="text-sm text-gray-500 line-clamp-1">{lesson.content}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => alert(`Viewing: ${lesson.title}\n\n${lesson.content}`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 rounded"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="p-1.5 text-gray-500 hover:text-amber-600 rounded"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowLessonModal(false);
            setEditingLesson(null);
            formik.resetForm();
          }}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingLesson ? "Edit Lesson" : "Add Lesson"}
              </h2>
              <button
                onClick={() => {
                  setShowLessonModal(false);
                  setEditingLesson(null);
                  formik.resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formik.values.section}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.section && formik.errors.section && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.section}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="order_no"
                    value={formik.values.order_no}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {formik.touched.order_no && formik.errors.order_no && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.order_no}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  name="content"
                  rows={4}
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Write lesson content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    name="video_url"
                    value={formik.values.video_url}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                  {formik.touched.video_url && formik.errors.video_url && (
                    <p className="text-red-500 text-xs mt-1">{formik.errors.video_url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Key</label>
                  <input
                    type="text"
                    name="video_url_key"
                    value={formik.values.video_url_key}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowLessonModal(false);
                    setEditingLesson(null);
                    formik.resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  {editingLesson ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}