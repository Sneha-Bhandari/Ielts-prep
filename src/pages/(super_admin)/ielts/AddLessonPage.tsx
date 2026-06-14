// import { useState } from "react";
// import { useFormik } from "formik";
// import {Plus, Eye, Pencil, Trash2,X,ArrowLeft,Clock,Hash,Video,FileText,Upload,Loader2,Play,FilePlay,} from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useIELTSStore } from "../../../store/ielts.store";
// import type { Lesson } from "../../../interfaces/ielts.interface";
// import { lessonSchema } from "../../../schema/lesson.schema";
// import type { LessonFormData } from "../../../schema/lesson.schema";

// export default function AddLessonPage() {
//   const navigate = useNavigate();
//   const { courseId, sectionId } = useParams();
//   const { courses, updateCourse } = useIELTSStore();

//   const course = courses.find((c) => c.id === courseId);
//   const section = course?.sections?.find((s) => s.id === sectionId);

//   const [open, setOpen] = useState(false);
//   const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
//   const [viewLesson, setViewLesson] = useState<Lesson | null>(null);
//   const [uploadingVideo, setUploadingVideo] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Simulate video upload to a cloud service
//   const uploadVideoToCloud = async (file: File): Promise<{ url: string; key: string }> => {
//     return new Promise((resolve) => {
//       const interval = setInterval(() => {
//         setUploadProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       setTimeout(() => {
//         clearInterval(interval);
//         const fakeUrl = URL.createObjectURL(file);
//         const fakeKey = `video_${Date.now()}_${file.name}`;
//         resolve({ url: fakeUrl, key: fakeKey });
//       }, 2000);
//     });
//   };

//   const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith('video/')) {
//       alert('Please upload a valid video file');
//       return;
//     }

//     if (file.size > 500 * 1024 * 1024) {
//       alert('Video file size should be less than 500MB');
//       return;
//     }

//     setUploadingVideo(true);
//     setUploadProgress(0);

//     try {
//       const { url, key } = await uploadVideoToCloud(file);
//       formik.setFieldValue('video_url', url);
//       formik.setFieldValue('video_url_key', key);
//     } catch (error) {
//       console.error('Upload failed:', error);
//       alert('Failed to upload video. Please try again.');
//     } finally {
//       setUploadingVideo(false);
//       setUploadProgress(0);
//     }
//   };

//   const formik = useFormik<LessonFormData>({
//     initialValues: {
//       section: sectionId || "",
//       title: "",
//       content: "",
//       video_url: "",
//       video_url_key: "",
//       duration: 0,
//       order_no: section?.lessons?.length ? section.lessons.length + 1 : 1,
//     },
//     validationSchema: lessonSchema,
//     enableReinitialize: true,
//     onSubmit: (values, { resetForm }) => {
//       if (!course || !section) return;

//       const updatedSections = (course.sections || []).map((sec) => {
//         if (sec.id !== section.id) return sec;

//         let lessons = [...(sec.lessons || [])];

//         if (editingLesson) {
//           lessons = lessons.map((lesson) =>
//             lesson.id === editingLesson.id ? { ...lesson, ...values, id: lesson.id } : lesson
//           );
//         } else {
//           lessons.push({
//             id: Date.now().toString(),
//             section: sectionId!,
//             title: values.title,
//             content: values.content,
//             video_url: values.video_url,
//             video_url_key: values.video_url_key,
//             duration: values.duration,
//             order_no: values.order_no,
//           });
//         }

//         return { ...sec, lessons };
//       });

//       updateCourse(course.id!, { ...course, sections: updatedSections });
//       resetForm();
//       setEditingLesson(null);
//       setOpen(false);
//     },
//   });

//   const handleEdit = (lesson: Lesson) => {
//     setEditingLesson(lesson);
//     formik.setValues({
//       section: lesson.section,
//       title: lesson.title,
//       content: lesson.content || "",
//       video_url: lesson.video_url || "",
//       video_url_key: lesson.video_url_key || "",
//       duration: lesson.duration || 0,
//       order_no: lesson.order_no,
//     });
//     setOpen(true);
//   };

//   const handleDelete = (lessonId: string) => {
//     if (!course || !section) return;
//     if (!window.confirm("Are you sure you want to delete this lesson?")) return;

//     const updatedSections = (course.sections || []).map((sec) => {
//       if (sec.id !== section.id) return sec;
//       return {
//         ...sec,
//         lessons: (sec.lessons || []).filter((lesson) => lesson.id !== lessonId),
//       };
//     });

//     updateCourse(course.id!, { ...course, sections: updatedSections });
//   };

//   const openAddModal = () => {
//     setEditingLesson(null);
//     formik.resetForm();
//     formik.setValues({
//       section: sectionId || "",
//       title: "",
//       content: "",
//       video_url: "",
//       video_url_key: "",
//       duration: 0,
//       order_no: section?.lessons?.length ? section.lessons.length + 1 : 1,
//     });
//     setOpen(true);
//   };

//   const removeVideo = () => {
//     formik.setFieldValue('video_url', '');
//     formik.setFieldValue('video_url_key', '');
//   };

//   if (!course || !section) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center max-w-sm p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
//           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-semibold">
//             📚
//           </div>
//           <h2 className="text-xl font-bold text-slate-900">Section not found</h2>
//           <p className="text-slate-500 text-sm mt-1 mb-5">The section you are looking for might have been moved or deleted.</p>
//           <button
//             onClick={() => navigate("/ielts/courses")}
//             className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
//           >
//             Back to Courses
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
//         {/* Header Navigation */}
//         <div className="mb-6 flex items-center justify-between">
//           <button
//             onClick={() => navigate(`/ielts/course/${course.id}/sections`)}
//             className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition group"
//           >
//             <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
//             <span>Back to Sections</span>
//           </button>
//         </div>

//         {/* Course Card Banner */}
//         <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm mb-8">
//           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//             <div>
//               <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
//                 Section Management
//               </span>
//               <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2 mb-1.5">{section.title}</h1>
//               <div className="flex items-center gap-2 text-slate-500 text-sm">
//                 <FileText size={15} className="text-slate-400" />
//                 <span className="font-medium">
//                   {section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? "lesson" : "lessons"} total
//                 </span>
//               </div>
//             </div>

//             <button
//               onClick={openAddModal}
//               className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-[0.98]"
//             >
//               <Plus size={16} strokeWidth={2.5} />
//               Add Lesson
//             </button>
//           </div>
//         </div>

//         {/* Lessons Area */}
//         {!section.lessons || section.lessons.length === 0 ? (
//           <div className="bg-white rounded-2xl border border-slate-200/60 border-dashed py-14 px-4 text-center max-w-xl mx-auto">
//             <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-4">
//               <FilePlay size={22} />
//             </div>
//             <h3 className="text-lg font-bold text-slate-900 mb-1">No lessons yet</h3>
//             <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
//               Get started by creating your very first instructional lesson for this curriculum section.
//             </p>
//             <button
//               onClick={openAddModal}
//               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
//             >
//               <Plus size={16} />
//               Create First Lesson
//             </button>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
//             {/* Desktop Table View */}
//             <div className="hidden md:block overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr className="bg-slate-50/70 border-b border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-500">
//                     <th className="px-6 py-4 w-16 text-center">Index</th>
//                     <th className="px-6 py-4">Lesson Details</th>
//                     <th className="px-6 py-4 w-32">Duration</th>
//                     <th className="px-6 py-4 w-32">Attachment</th>
//                     <th className="px-6 py-4 w-28 text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {section.lessons
//                     .sort((a, b) => a.order_no - b.order_no)
//                     .map((lesson) => (
//                       <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors group">
//                         <td className="px-6 py-4 text-center">
//                           <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-mono text-xs font-bold px-2 py-1 rounded-md">
//                             {lesson.order_no}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
//                             {lesson.title}
//                           </div>
//                           {lesson.content && (
//                             <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5 max-w-xl">
//                               {lesson.content}
//                             </p>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-medium">
//                             <Clock size={14} className="text-slate-400" />
//                             <span>{lesson.duration} mins</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {lesson.video_url ? (
//                             <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200/40">
//                               <Video size={12} strokeWidth={2.5} />
//                               Video Asset
//                             </span>
//                           ) : (
//                             <span className="text-slate-300 text-xs font-medium">None</span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <div className="inline-flex items-center justify-end gap-1.5">
//                             <button
//                               onClick={() => setViewLesson(lesson)}
//                               className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
//                               title="View Lesson"
//                             >
//                               <Eye size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleEdit(lesson)}
//                               className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                               title="Edit Lesson"
//                             >
//                               <Pencil size={16} />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(lesson.id!)}
//                               className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                               title="Delete Lesson"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile List/Card View */}
//             <div className="block md:hidden divide-y divide-slate-100">
//               {section.lessons
//                 .sort((a, b) => a.order_no - b.order_no)
//                 .map((lesson) => (
//                   <div key={lesson.id} className="p-4 space-y-3">
//                     <div className="flex items-start justify-between gap-2">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2">
//                           <span className="bg-slate-100 text-slate-700 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded">
//                             #{lesson.order_no}
//                           </span>
//                           <h4 className="font-bold text-slate-900 text-sm">{lesson.title}</h4>
//                         </div>
//                         {lesson.content && (
//                           <p className="text-xs text-slate-400 line-clamp-2">{lesson.content}</p>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-1 shrink-0">
//                         <button
//                           onClick={() => setViewLesson(lesson)}
//                           className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(lesson)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                         >
//                           <Pencil size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(lesson.id!)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
//                       <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
//                         <Clock size={13} /> {lesson.duration} mins
//                       </span>
//                       {lesson.video_url ? (
//                         <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
//                           Has Video
//                         </span>
//                       ) : (
//                         <span className="text-slate-400">No Video</span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Lesson Modal */}
//       {open && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
//             onClick={() => {
//               setOpen(false);
//               formik.resetForm();
//               setEditingLesson(null);
//             }}
//           />

//           {/* Modal Container */}
//           <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-slate-200/50 flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
//             {/* Header */}
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
//               <div>
//                 <h3 className="text-lg font-bold text-slate-900">
//                   {editingLesson ? "Edit Lesson Details" : "Add New Lesson"}
//                 </h3>
//                 <p className="text-xs text-slate-400 font-medium mt-0.5">
//                   {editingLesson ? "Modify curriculum details" : "Populate fields to extend section materials"}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   setOpen(false);
//                   formik.resetForm();
//                   setEditingLesson(null);
//                 }}
//                 className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Scrollable Form Body */}
//             <form onSubmit={formik.handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1 text-sm">
//               {/* Title Field */}
//               <div className="space-y-1.5">
//                 <label className="block font-semibold text-slate-700">
//                   Lesson Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="title"
//                   type="text"
//                   placeholder="e.g., Introduction to Segment 1 Architecture"
//                   value={formik.values.title}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   className={`w-full px-3.5 py-2 border rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
//                     formik.touched.title && formik.errors.title
//                       ? "border-red-400 focus:ring-red-100 focus:border-red-500"
//                       : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
//                   }`}
//                 />
//                 {formik.touched.title && formik.errors.title && (
//                   <p className="text-xs text-red-600 font-medium pl-0.5">{formik.errors.title}</p>
//                 )}
//               </div>

//               {/* Content Field */}
//               <div className="space-y-1.5">
//                 <label className="block font-semibold text-slate-700">Description / Content</label>
//                 <textarea
//                   rows={3}
//                   name="content"
//                   placeholder="Provide explicit context, lecture summaries, or instructions..."
//                   value={formik.values.content}
//                   onChange={formik.handleChange}
//                   className="w-full px-3.5 py-2 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none"
//                 />
//               </div>

//               {/* Dynamic Video Section */}
//               <div className="space-y-2">
//                 <label className="block font-semibold text-slate-700 flex items-center gap-1.5">
//                   <Video size={14} className="text-slate-400" />
//                   Media Attachment <span className="text-red-500">*</span>
//                 </label>
                
//                 {!formik.values.video_url ? (
//                   <div className="border-2 border-dashed border-slate-200 bg-slate-50/30 hover:bg-slate-50/80 hover:border-blue-400 rounded-xl p-5 text-center transition-all relative group">
//                     <input
//                       type="file"
//                       accept="video/*"
//                       onChange={handleVideoUpload}
//                       className="hidden"
//                       id="video-upload"
//                       disabled={uploadingVideo}
//                     />
//                     <label htmlFor="video-upload" className="cursor-pointer block space-y-2">
//                       {uploadingVideo ? (
//                         <div className="py-2 space-y-3 max-w-xs mx-auto">
//                           <Loader2 size={24} className="mx-auto text-blue-600 animate-spin" />
//                           <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
//                             <div
//                               className="bg-blue-600 h-full rounded-full transition-all duration-300"
//                               style={{ width: `${uploadProgress}%` }}
//                             />
//                           </div>
//                           <p className="text-xs text-slate-500 font-semibold">
//                             Uploading video asset... {uploadProgress}%
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="py-2">
//                           <Upload size={28} className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
//                           <p className="text-xs font-bold text-slate-700 mb-0.5">
//                             Click to upload high-fidelity video
//                           </p>
//                           <p className="text-[11px] text-slate-400 font-medium">
//                             MP4, WebM, or OGG extensions up to 500MB
//                           </p>
//                         </div>
//                       )}
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
//                     <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
//                       <div className="flex items-center gap-2 min-w-0">
//                         <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 text-emerald-600">
//                           <Play size={14} fill="currentColor" />
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-xs font-bold text-slate-900 truncate">Video Attached Successfully</p>
//                           <p className="text-[10px] text-slate-400 font-mono font-medium truncate max-w-[240px]">
//                             {formik.values.video_url_key}
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={removeVideo}
//                         className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                     {formik.values.video_url && (
//                       <div className="p-2 bg-slate-950 flex justify-center aspect-video max-h-[180px]">
//                         <video
//                           src={formik.values.video_url}
//                           controls
//                           className="h-full max-w-full object-contain rounded"
//                         >
//                           Your browser does not support HTML5 video tags.
//                         </video>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {formik.touched.video_url && formik.errors.video_url && (
//                   <p className="text-xs text-red-600 font-medium pl-0.5">{formik.errors.video_url}</p>
//                 )}
//               </div>

//               {/* Grid Fields: Duration & Order */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="block font-semibold text-slate-700 flex items-center gap-1">
//                     <Clock size={13} className="text-slate-400" />
//                     Duration <span className="text-red-500">*</span> <span className="text-slate-400 font-normal text-xs">(mins)</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="duration"
//                     placeholder="0"
//                     min="1"
//                     value={formik.values.duration}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full px-3 py-2 border rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
//                       formik.touched.duration && formik.errors.duration
//                         ? "border-red-400 focus:ring-red-100 focus:border-red-500"
//                         : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
//                     }`}
//                   />
//                   {formik.touched.duration && formik.errors.duration && (
//                     <p className="text-xs text-red-600 font-medium pl-0.5">{formik.errors.duration}</p>
//                   )}
//                 </div>

//                 <div className="space-y-1.5">
//                   <label className="block font-semibold text-slate-700 flex items-center gap-1">
//                     <Hash size={13} className="text-slate-400" />
//                     Order Position <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     name="order_no"
//                     placeholder="1"
//                     min="1"
//                     value={formik.values.order_no}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full px-3 py-2 border rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
//                       formik.touched.order_no && formik.errors.order_no
//                         ? "border-red-400 focus:ring-red-100 focus:border-red-500"
//                         : "border-slate-200 focus:ring-blue-100 focus:border-blue-500"
//                     }`}
//                   />
//                   {formik.touched.order_no && formik.errors.order_no && (
//                     <p className="text-xs text-red-600 font-medium pl-0.5">{formik.errors.order_no}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-4 border-t border-slate-100 shrink-0">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setOpen(false);
//                     formik.resetForm();
//                     setEditingLesson(null);
//                   }}
//                   className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.99] transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={uploadingVideo}
//                   className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition-all"
//                 >
//                   {editingLesson ? "Save Changes" : "Create Lesson"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Details Sidebar-style Modal */}
//       {viewLesson && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
//           <div 
//             className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
//             onClick={() => setViewLesson(null)}
//           />

//           <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200/50 flex flex-col max-h-[85vh] overflow-hidden transform transition-all">
//             {/* Header */}
//             <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 shrink-0">
//               <div className="min-w-0">
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="bg-slate-200/80 text-slate-800 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded">
//                     Position {viewLesson.order_no}
//                   </span>
//                   <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-xs">
//                     <Clock size={12} /> {viewLesson.duration} minutes
//                   </span>
//                 </div>
//                 <h3 className="text-lg font-bold text-slate-900 truncate">{viewLesson.title}</h3>
//               </div>
//               <button
//                 onClick={() => setViewLesson(null)}
//                 className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-lg transition-colors shrink-0"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Scrollable View Content */}
//             <div className="overflow-y-auto p-6 space-y-5 text-sm flex-1">
//               {viewLesson.video_url && (
//                 <div className="space-y-2">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Video Playback</h4>
//                   <div className="bg-slate-950 rounded-xl overflow-hidden shadow-inner flex justify-center aspect-video max-h-[260px] w-full">
//                     <video
//                       src={viewLesson.video_url}
//                       controls
//                       className="h-full max-w-full object-contain"
//                     >
//                       Your browser does not support HTML5 video tags.
//                     </video>
//                   </div>
//                 </div>
//               )}

//               {viewLesson.content && (
//                 <div className="space-y-2">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lesson Material & Notes</h4>
//                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
//                     {viewLesson.content}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="px-6 py-3 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/30">
//               <button
//                 onClick={() => setViewLesson(null)}
//                 className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
//               >
//                 Dismiss View
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from "react";
// import { Plus, Eye, Pencil, Trash2, ArrowLeft, Clock, FileText, FilePlay } from "lucide-react";
import {Plus, Eye, Pencil, Trash2,X,ArrowLeft,Clock,Hash,Video,FileText,Upload,Loader2,Play,FilePlay,} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { useIELTSStore } from "../../../store/ielts.store";
import type { Lesson } from "../../../interfaces/ielts.interface";
import AddLessonModal from "./AddLessonModal";
import EditLessonModal from "./EditLessonModal";

export default function AddLessonPage() {
  const navigate = useNavigate();
  const { courseId, sectionId } = useParams();
  const { courses, updateCourse } = useIELTSStore();

  const course = courses.find((c) => c.id === courseId);
  const section = course?.sections?.find((s) => s.id === sectionId);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [viewLesson, setViewLesson] = useState<Lesson | null>(null);

  const handleDelete = (lessonId: string) => {
    if (!course || !section) return;
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    const updatedSections = (course.sections || []).map((sec) => {
      if (sec.id !== section.id) return sec;
      return {
        ...sec,
        lessons: (sec.lessons || []).filter((lesson) => lesson.id !== lessonId),
      };
    });

    updateCourse(course.id!, { ...course, sections: updatedSections });
  };

  const handleAddLesson = (values: any) => {
    if (!course || !section) return;

    const updatedSections = (course.sections || []).map((sec) => {
      if (sec.id !== section.id) return sec;

      return {
        ...sec,
        lessons: [
          ...(sec.lessons || []),
          {
            id: Date.now().toString(),
            section: sectionId!,
            ...values,
          },
        ],
      };
    });

    updateCourse(course.id!, { ...course, sections: updatedSections });
  };

  const handleEditLesson = (values: any) => {
    if (!course || !section || !editingLesson) return;

    const updatedSections = (course.sections || []).map((sec) => {
      if (sec.id !== section.id) return sec;

      return {
        ...sec,
        lessons: (sec.lessons || []).map((lesson) =>
          lesson.id === editingLesson.id ? { ...lesson, ...values } : lesson
        ),
      };
    });

    updateCourse(course.id!, { ...course, sections: updatedSections });
  };

  if (!course || !section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-sm p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 font-semibold">
            📚
          </div>
          <h2 className="text-xl font-bold text-slate-900">Section not found</h2>
          <p className="text-slate-500 text-sm mt-1 mb-5">The section you are looking for might have been moved or deleted.</p>
          <button
            onClick={() => navigate("/ielts/courses")}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(`/ielts/course/${course.id}/sections`)}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium text-sm transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Sections</span>
          </button>
        </div>

        {/* Course Card Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Section Management
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2 mb-1.5">{section.title}</h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <FileText size={15} className="text-slate-400" />
                <span className="font-medium">
                  {section.lessons?.length || 0} {(section.lessons?.length || 0) === 1 ? "lesson" : "lessons"} total
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Lesson
            </button>
          </div>
        </div>

        {/* Lessons Area */}
        {!section.lessons || section.lessons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 border-dashed py-14 px-4 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mx-auto mb-4">
              <FilePlay size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No lessons yet</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
              Get started by creating your very first instructional lesson for this curriculum section.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
            >
              <Plus size={16} />
              Create First Lesson
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 w-16 text-center">Index</th>
                    <th className="px-6 py-4">Lesson Details</th>
                    <th className="px-6 py-4 w-32">Duration</th>
                    <th className="px-6 py-4 w-32">Attachment</th>
                    <th className="px-6 py-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {section.lessons
                    .sort((a, b) => a.order_no - b.order_no)
                    .map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center bg-slate-100 text-slate-700 font-mono text-xs font-bold px-2 py-1 rounded-md">
                            {lesson.order_no}
                          </span>
                         </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                          </div>
                          {lesson.content && (
                            <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5 max-w-xl">
                              {lesson.content}
                            </p>
                          )}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                            <Clock size={14} className="text-slate-400" />
                            <span>{lesson.duration} mins</span>
                          </div>
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lesson.video_url ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md border border-emerald-200/40">
                              Video Asset
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs font-medium">None</span>
                          )}
                         </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewLesson(lesson)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Lesson"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setEditingLesson(lesson)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Lesson"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(lesson.id!)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Lesson"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                         </td>
                       </tr>
                    ))}
                </tbody>
               </table>
            </div>

            {/* Mobile List/Card View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {section.lessons
                .sort((a, b) => a.order_no - b.order_no)
                .map((lesson) => (
                  <div key={lesson.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded">
                            #{lesson.order_no}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{lesson.title}</h4>
                        </div>
                        {lesson.content && (
                          <p className="text-xs text-slate-400 line-clamp-2">{lesson.content}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setViewLesson(lesson)}
                          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditingLesson(lesson)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
                      <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                        <Clock size={13} /> {lesson.duration} mins
                      </span>
                      {lesson.video_url ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          Has Video
                        </span>
                      ) : (
                        <span className="text-slate-400">No Video</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Lesson Modal */}
      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLesson}
        nextOrderNo={section.lessons?.length ? section.lessons.length + 1 : 1}
        sectionId={sectionId!}
      />

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <EditLessonModal
          isOpen={!!editingLesson}
          onClose={() => setEditingLesson(null)}
          onSubmit={handleEditLesson}
          initialValues={editingLesson}
        />
      )}

      {/* View Details Sidebar-style Modal */}
      {viewLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setViewLesson(null)}
          />

          <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200/50 flex flex-col max-h-[85vh] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-200/80 text-slate-800 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded">
                    Position {viewLesson.order_no}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 font-medium text-xs">
                    <Clock size={12} /> {viewLesson.duration} minutes
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 truncate">{viewLesson.title}</h3>
              </div>
              <button
                onClick={() => setViewLesson(null)}
                className="p-1.5 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-lg transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable View Content */}
            <div className="overflow-y-auto p-6 space-y-5 text-sm flex-1">
              {viewLesson.video_url && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Attached Video Playback</h4>
                  <div className="bg-slate-950 rounded-xl overflow-hidden shadow-inner flex justify-center aspect-video max-h-[260px] w-full">
                    <video
                      src={viewLesson.video_url}
                      controls
                      className="h-full max-w-full object-contain"
                    >
                      Your browser does not support HTML5 video tags.
                    </video>
                  </div>
                </div>
              )}

              {viewLesson.content && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Lesson Material & Notes</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                    {viewLesson.content}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 flex justify-end shrink-0 bg-slate-50/30">
              <button
                onClick={() => setViewLesson(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}