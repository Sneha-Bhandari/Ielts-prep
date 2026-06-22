// import { useState } from "react";
// import { Plus, Pencil, Trash2, Globe, GraduationCap, X, Search, LayoutGrid, List } from "lucide-react";
// import AddCourses from "./AddCourses";
// import { useAppMutation, useAppQuery } from "../../../lib/react-query";
// import { useQueryClient } from "@tanstack/react-query";

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

// interface Courses {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: Thumbnail;
//   language: Language;
//   level: string;
//   isPublished: boolean;
//   price: string;
//   sections: any[];
//   createdAt?: string;
//   updatedAt?: string;
//   deletedAt?: string | null;
//   createdBy?: string | null;
//   updatedBy?: string | null;
//   deletedBy?: string | null;
// }

// export default function CourseCategory() {
//   const [open, setOpen] = useState(false);
//   const queryClient = useQueryClient();
//   const [viewType, setViewType] = useState("grid");
//   const [searchQuery, setSearchQuery] = useState("");

//   const { data: courses = [], isLoading } = useAppQuery<Courses[]>({
//     url: "/courses",
//     queryKey: ["courses"],
//   });

//   const { mutate: deleteCourses } = useAppMutation({
//     url: "/courses",
//     type: "delete",
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["ielts-courses"] });
//     },
//   });


//   const filteredCourses = courses.filter((course) =>
//     course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     course.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/30 min-h-screen font-sans antialiased">

//       {/* HEADER SECTION */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//             Course Management
//           </h1>
//           <p className="text-sm text-slate-500 mt-0.5">
//             Build, edit, and orchestrate high-tier courses and modules.
//           </p>
//         </div>

//         <button
//           onClick={() => setOpen(true)}
//           className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition-colors"
//         >
//           <Plus className="w-4 h-4 stroke-[2]" />
//           Add New Course
//         </button>
//       </div>

//       {/* FILTER & VIEW CONTROLS */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search courses..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800 placeholder-slate-400 bg-slate-50/50"
//           />
//         </div>

//         {/* Layout Toggles */}
//         <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
//           <button
//             onClick={() => setViewType("grid")}
//             className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//             title="Grid View"
//           >
//             <LayoutGrid className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setViewType("list")}
//             className={`p-1.5 rounded-lg transition-all ${viewType === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//             title="List View"
//           >
//             <List className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* LOADING STATE */}
//       {isLoading ? (
//         <div className="flex items-center justify-center py-24 text-slate-500 font-medium text-sm">
//           Loading courses...
//         </div>
//       ) : viewType === "grid" ? (
//         /* --- GRID CONTAINER --- */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map((course) => (
//             <div
//               key={course.id}
//               className="group flex flex-col bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//             >
//               <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
//                 <img
//                   src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 inset-x-3 flex justify-between items-center">
//                   <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-medium text-slate-700 shadow-sm border border-slate-200/40">
//                     {course.level}
//                   </span>
//                   <span className={`px-2 py-0.5 rounded-md text-xs font-medium shadow-sm border ${course.isPublished
//                     ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
//                     : "bg-amber-50 text-amber-700 border-amber-200/60"
//                     }`}>
//                     {course.isPublished ? "Published" : "Draft"}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-5 flex flex-col flex-1 justify-between">
//                 <div>
//                   <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
//                     {course.title}
//                   </h2>
//                   <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
//                     {course.description}
//                   </p>

//                   <div className="mt-4 flex gap-3 text-xs font-medium text-slate-500 border-b border-slate-100 pb-3">
//                     <span className="flex items-center gap-1.5">
//                       <GraduationCap className="w-3.5 h-3.5  text-slate-400" />
//                       {course.level}
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                       <Globe className="w-3.5 h-3.5 text-slate-400" />
//                       {course.language?.name || "English"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-0.5 flex items-center justify-between">
//                   <div>
//                     <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
//                     <span className="text-base font-semibold text-slate-900">
//                       NPR {Number(course.price || 0).toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5">
//                     <button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition-colors" title="Edit">
//                       <Pencil className="w-3.5 h-3.5" />
//                     </button>
//                     <button
//                      className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors" title="Delete">
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* --- LIST CONTAINER --- */
//         <div className="space-y-4">
//           {filteredCourses.map((course) => (
//             <div
//               key={course.id}
//               className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//             >
//               <div className="relative w-full sm:w-48 h-36 flex-shrink-0 bg-slate-100 overflow-hidden">
//                 <img
//                   src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
//                 />
//               </div>

//               <div className="p-5 flex flex-col sm:flex-row flex-1 justify-between gap-4">
//                 <div className="space-y-1.5 max-w-2xl">
//                   <div className="flex items-center gap-2">
//                     <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${course.isPublished
//                       ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
//                       : "bg-amber-50 text-amber-700 border-amber-200/60"
//                       }`}>
//                       {course.isPublished ? "Published" : "Draft"}
//                     </span>
//                     <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
//                       <GraduationCap className="w-3.5 h-3.5" /> {course.level} • {course.language?.name || "English"}
//                     </span>
//                   </div>

//                   <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
//                     {course.title}
//                   </h2>
//                   <p className="text-xs text-slate-500 leading-relaxed">
//                     {course.description}
//                   </p>
//                 </div>

//                 <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
//                   <div className="text-left sm:text-right">
//                     <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
//                     <span className="text-base font-semibold text-slate-900">
//                       NPR {Number(course.price || 0).toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5">
//                     <button className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition-colors">
//                       <Pencil className="w-3.5 h-3.5" />
//                     </button>
//                     <button className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors">
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* NO RESULTS DISPLAY */}
//       {!isLoading && filteredCourses.length === 0 && (
//         <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
//           No matches found for your search query.
//         </div>
//       )}

//       {/* MODAL WINDOW */}
//       {open && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transform transition-all duration-300">

//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-900">Add New Course</h2>
//                 <p className="text-xs text-slate-500">Configure parameters to initialize a course asset.</p>
//               </div>
//               <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6 text-sm text-slate-600 overflow-y-auto max-h-[calc(100vh-200px)] bg-slate-50/20">
//               <AddCourses onClose={() => setOpen(false)} />
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// import { useState } from "react";
// import { Plus, Pencil, Trash2, Globe, GraduationCap, X, Search, LayoutGrid, List, AlertTriangle } from "lucide-react";
// import AddCourses from "./AddCourses";
// import { useAppMutation, useAppQuery } from "../../../lib/react-query";
// import { useQueryClient } from "@tanstack/react-query";
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

// interface Courses {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: Thumbnail;
//   language: Language;
//   level: string;
//   isPublished: boolean;
//   price: string;
//   sections: any[];
//   createdAt?: string;
//   updatedAt?: string;
//   deletedAt?: string | null;
//   createdBy?: string | null;
//   updatedBy?: string | null;
//   deletedBy?: string | null;
// }

// export default function CourseCategory() {
//   const [open, setOpen] = useState(false);
//   const [editingCourse, setEditingCourse] = useState<Courses | null>(null);
//   const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
//   const queryClient = useQueryClient();
//   const [viewType, setViewType] = useState("grid");
//   const [searchQuery, setSearchQuery] = useState("");

//   const { data: courses = [], isLoading } = useAppQuery<Courses[]>({
//     url: "/courses",
//     queryKey: ["courses"],
//   });

//   const { mutate: deleteCourses, isPending: isDeleting } = useAppMutation({
//     url: "/courses",
//     type: "delete",
//     onSuccess: () => {
//       toast.success("Course deleted successfully");
//       queryClient.invalidateQueries({ queryKey: ["courses"] });
//       setDeletingCourseId(null);
//     },
//     onError: () => {
//       toast.error("Failed to delete the course");
//     }
//   });

//   const handleEditClick = (course: Courses) => {
//     setEditingCourse(course);
//     setOpen(true);
//   };

//   const handleAddNewClick = () => {
//     setEditingCourse(null);
//     setOpen(true);
//   };

//   const handleCloseModal = () => {
//     setOpen(false);
//     setEditingCourse(null);
//   };

//   const handleDeleteConfirm = () => {
//     if (deletingCourseId) {
//       deleteCourses({ id: deletingCourseId });
//     }
//   };

//   const filteredCourses = courses.filter((course) =>
//     course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     course.description?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/30 min-h-screen font-sans antialiased">

//       {/* HEADER SECTION */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//             Course Management
//           </h1>
//           <p className="text-sm text-slate-500 mt-0.5">
//             Build, edit, and orchestrate high-tier courses and modules.
//           </p>
//         </div>

//         <button
//           onClick={handleAddNewClick}
//           className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-sm transition-colors"
//         >
//           <Plus className="w-4 h-4 stroke-[2]" />
//           Add New Course
//         </button>
//       </div>

//       {/* FILTER & VIEW CONTROLS */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search courses..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800 placeholder-slate-400 bg-slate-50/50"
//           />
//         </div>

//         {/* Layout Toggles */}
//         <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
//           <button
//             onClick={() => setViewType("grid")}
//             className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//             title="Grid View"
//           >
//             <LayoutGrid className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setViewType("list")}
//             className={`p-1.5 rounded-lg transition-all ${viewType === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//             title="List View"
//           >
//             <List className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* LOADING STATE */}
//       {isLoading ? (
//         <div className="flex items-center justify-center py-24 text-slate-500 font-medium text-sm">
//           Loading courses...
//         </div>
//       ) : viewType === "grid" ? (
//         /* --- GRID CONTAINER --- */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map((course) => (
//             <div
//               key={course.id}
//               className="group flex flex-col bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//             >
//               <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
//                 <img
//                   src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 inset-x-3 flex justify-between items-center">
//                   <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-medium text-slate-700 shadow-sm border border-slate-200/40">
//                     {course.level}
//                   </span>
//                   <span className={`px-2 py-0.5 rounded-md text-xs font-medium shadow-sm border ${course.isPublished
//                     ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
//                     : "bg-amber-50 text-amber-700 border-amber-200/60"
//                     }`}>
//                     {course.isPublished ? "Published" : "Draft"}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-5 flex flex-col flex-1 justify-between">
//                 <div>
//                   <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
//                     {course.title}
//                   </h2>
//                   <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
//                     {course.description}
//                   </p>

//                   <div className="mt-4 flex gap-3 text-xs font-medium text-slate-500 border-b border-slate-100 pb-3">
//                     <span className="flex items-center gap-1.5">
//                       <GraduationCap className="w-3.5 h-3.5  text-slate-400" />
//                       {course.level}
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                       <Globe className="w-3.5 h-3.5 text-slate-400" />
//                       {course.language?.name || "English"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-0.5 flex items-center justify-between">
//                   <div>
//                     <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
//                     <span className="text-base font-semibold text-slate-900">
//                       NPR {Number(course.price || 0).toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5">
//                     <button 
//                       onClick={() => handleEditClick(course)}
//                       className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition-colors" 
//                       title="Edit"
//                     >
//                       <Pencil className="w-3.5 h-3.5" />
//                     </button>
//                     <button
//                       onClick={() => setDeletingCourseId(course.id)}
//                       className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors" 
//                       title="Delete"
//                     >
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* --- LIST CONTAINER --- */
//         <div className="space-y-4">
//           {filteredCourses.map((course) => (
//             <div
//               key={course.id}
//               className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//             >
//               <div className="relative w-full sm:w-48 h-36 flex-shrink-0 bg-slate-100 overflow-hidden">
//                 <img
//                   src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
//                 />
//               </div>

//               <div className="p-5 flex flex-col sm:flex-row flex-1 justify-between gap-4">
//                 <div className="space-y-1.5 max-w-2xl">
//                   <div className="flex items-center gap-2">
//                     <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${course.isPublished
//                       ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
//                       : "bg-amber-50 text-amber-700 border-amber-200/60"
//                       }`}>
//                       {course.isPublished ? "Published" : "Draft"}
//                     </span>
//                     <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
//                       <GraduationCap className="w-3.5 h-3.5" /> {course.level} • {course.language?.name || "English"}
//                     </span>
//                   </div>

//                   <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
//                     {course.title}
//                   </h2>
//                   <p className="text-xs text-slate-500 leading-relaxed">
//                     {course.description}
//                   </p>
//                 </div>

//                 <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
//                   <div className="text-left sm:text-right">
//                     <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
//                     <span className="text-base font-semibold text-slate-900">
//                       NPR {Number(course.price || 0).toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5">
//                     <button 
//                       onClick={() => handleEditClick(course)}
//                       className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 transition-colors"
//                     >
//                       <Pencil className="w-3.5 h-3.5" />
//                     </button>
//                     <button 
//                       onClick={() => setDeletingCourseId(course.id)}
//                       className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors"
//                     >
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* NO RESULTS DISPLAY */}
//       {!isLoading && filteredCourses.length === 0 && (
//         <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
//           No matches found for your search query.
//         </div>
//       )}

//       {/* ADD/EDIT MODAL WINDOW */}
//       {open && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transform transition-all duration-300">

//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//               <div>
//                 <h2 className="text-lg font-semibold text-slate-900">
//                   {editingCourse ? "Edit Course" : "Add New Course"}
//                 </h2>
//                 <p className="text-xs text-slate-500">
//                   {editingCourse ? "Modify existing assets and rulesets." : "Configure parameters to initialize a course asset."}
//                 </p>
//               </div>
//               <button onClick={handleCloseModal} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6 text-sm text-slate-600 overflow-y-auto max-h-[calc(100vh-200px)] bg-slate-50/20">
//               <AddCourses onClose={handleCloseModal} initialData={editingCourse} />
//             </div>

//           </div>
//         </div>
//       )}

//       {/* NATIVE DELETE CONFIRMATION MODAL */}
//       {deletingCourseId && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-red-50 rounded-xl text-red-600">
//                 <AlertTriangle className="w-6 h-6" />
//               </div>
//               <div>
//                 <h3 className="text-base font-semibold text-slate-900">Confirm Deletion</h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   Are you sure you want to delete this course item? This action breaks down schema matrices and cannot be undone.
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2.5 pt-2">
//               <button
//                 disabled={isDeleting}
//                 onClick={() => setDeletingCourseId(null)}
//                 className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={isDeleting}
//                 onClick={handleDeleteConfirm}
//                 className="px-3.5 py-2 text-xs font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
//               >
//                 {isDeleting ? "Deleting..." : "Delete Axis"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






// import { useState } from "react";
// import { Plus, Globe, GraduationCap, Search, LayoutGrid, List, AlertTriangle, Trash2 } from "lucide-react";
// import { useAppMutation, useAppQuery } from "../../../lib/react-query";
// import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "react-toastify";
// import CourseCard from "../../../components/Cards/CourseCard";

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

// interface Courses {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail: Thumbnail;
//   language: Language;
//   level: string;
//   isPublished: boolean;
//   price: string;
//   sections: any[];
//   createdAt?: string;
//   updatedAt?: string;
//   deletedAt?: string | null;
//   createdBy?: string | null;
//   updatedBy?: string | null;
//   deletedBy?: string | null;
// }

// export default function CourseCategory() {
//   const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
//   const queryClient = useQueryClient();
//   const [viewType, setViewType] = useState("grid");
//   const [searchQuery, setSearchQuery] = useState("");

//   const { data: courses = [], isLoading } = useAppQuery<Courses[]>({
//     url: "/courses",
//     queryKey: ["courses"],
//   });

//   const { mutate: deleteCourses, isPending: isDeleting } = useAppMutation({
//     url: "/courses",
//     type: "delete",
//     onSuccess: () => {
//       toast.success("Course deleted successfully");
//       queryClient.invalidateQueries({ queryKey: ["courses"] });
//       setDeletingCourseId(null);
//     },
//     onError: () => {
//       toast.error("Failed to delete the course");
//     }
//   });

//   const handleDeleteConfirm = () => {
//     if (deletingCourseId) {
//       deleteCourses({ id: deletingCourseId });
//     }
//   };

//   const filteredCourses = courses.filter((course) =>
//     course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     course.description?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/30 min-h-screen font-sans antialiased">

//       {/* HEADER SECTION */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
//         <div>
//           <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//             Course Management
//           </h1>
//           <p className="text-sm text-slate-500 mt-0.5">
//             View and manage high-tier courses and modules.
//           </p>
//         </div>
//       </div>

//       {/* FILTER & VIEW CONTROLS */}
//       <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
//         <div className="relative w-full sm:w-80">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search courses..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800 placeholder-slate-400 bg-slate-50/50"
//           />
//         </div>

//         {/* Layout Toggles */}
//         <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
//           <button
//             onClick={() => setViewType("grid")}
//             className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//             title="Grid View"
//           >
//             <LayoutGrid className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setViewType("list")}
//             className={`p-1.5 rounded-lg transition-all ${viewType === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
//             title="List View"
//           >
//             <List className="w-4 h-4" />
//           </button>
//         </div>
//       </div>

//       {/* LOADING STATE */}
//       {isLoading ? (
//         <div className="flex items-center justify-center py-24 text-slate-500 font-medium text-sm">
//           Loading courses...
//         </div>
//       ) : viewType === "grid" ? (
//         /* --- GRID CONTAINER --- */
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map((course) => (
//             <div
//               key={course.id}
//               className="group flex flex-col bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//             >
//               <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
//                 <img
//                   src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
//                 />
//                 <div className="absolute top-3 inset-x-3 flex justify-between items-center">
//                   <span className="bg-white/95 backdrop-blur px-2 py-0.5 rounded-md text-xs font-medium text-slate-700 shadow-sm border border-slate-200/40">
//                     {course.level}
//                   </span>
//                   <span className={`px-2 py-0.5 rounded-md text-xs font-medium shadow-sm border ${course.isPublished
//                     ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
//                     : "bg-amber-50 text-amber-700 border-amber-200/60"
//                     }`}>
//                     {course.isPublished ? "Published" : "Draft"}
//                   </span>
//                 </div>
//               </div>

//               <div className="p-5 flex flex-col flex-1 justify-between">
//                 <div>
//                   <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
//                     {course.title}
//                   </h2>
//                   <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
//                     {course.description}
//                   </p>

//                   <div className="mt-4 flex gap-3 text-xs font-medium text-slate-500 border-b border-slate-100 pb-3">
//                     <span className="flex items-center gap-1.5">
//                       <GraduationCap className="w-3.5 h-3.5  text-slate-400" />
//                       {course.level}
//                     </span>
//                     <span className="flex items-center gap-1.5">
//                       <Globe className="w-3.5 h-3.5 text-slate-400" />
//                       {course.language?.name || "English"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 pt-0.5 flex items-center justify-between">
//                   <div>
//                     <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
//                     <span className="text-base font-semibold text-slate-900">
//                       NPR {Number(course.price || 0).toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5">
//                     <button
//                       onClick={() => setDeletingCourseId(course.id)}
//                       className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors" 
//                       title="Delete"
//                     >
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         /* --- LIST CONTAINER --- */
//         <div className="space-y-4">
//           {filteredCourses.map((course) => (
//             <div
//               key={course.id}
//               className="group flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//             >
//               <div className="relative w-full sm:w-48 h-36 flex-shrink-0 bg-slate-100 overflow-hidden">
//                 <img
//                   src={course.thumbnail?.url || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"}
//                   alt={course.title}
//                   className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
//                 />
//               </div>

//               <div className="p-5 flex flex-col sm:flex-row flex-1 justify-between gap-4">
//                 <div className="space-y-1.5 max-w-2xl">
//                   <div className="flex items-center gap-2">
//                     <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${course.isPublished
//                       ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
//                       : "bg-amber-50 text-amber-700 border-amber-200/60"
//                       }`}>
//                       {course.isPublished ? "Published" : "Draft"}
//                     </span>
//                     <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
//                       <GraduationCap className="w-3.5 h-3.5" /> {course.level} • {course.language?.name || "English"}
//                     </span>
//                   </div>

//                   <h2 className="text-base font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
//                     {course.title}
//                   </h2>
//                   <p className="text-xs text-slate-500 leading-relaxed">
//                     {course.description}
//                   </p>
//                 </div>

//                 <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
//                   <div className="text-left sm:text-right">
//                     <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">Tuition</span>
//                     <span className="text-base font-semibold text-slate-900">
//                       NPR {Number(course.price || 0).toLocaleString()}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-1.5">
//                     <button 
//                       onClick={() => setDeletingCourseId(course.id)}
//                       className="p-1.5 rounded-lg bg-red-50/40 hover:bg-red-50 border border-red-100 text-red-600 transition-colors"
//                       title="Delete"
//                     >
//                       <Trash2 className="w-3.5 h-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* NO RESULTS DISPLAY */}
//       {!isLoading && filteredCourses.length === 0 && (
//         <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
//           No matches found for your search query.
//         </div>
//       )}

//       {/* NATIVE DELETE CONFIRMATION MODAL */}
//       {deletingCourseId && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
//             <div className="flex items-start gap-3">
//               <div className="p-2 bg-red-50 rounded-xl text-red-600">
//                 <AlertTriangle className="w-6 h-6" />
//               </div>
//               <div>
//                 <h3 className="text-base font-semibold text-slate-900">Confirm Deletion</h3>
//                 <p className="text-xs text-slate-500 mt-1">
//                   Are you sure you want to delete this course item? This action breaks down schema matrices and cannot be undone.
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2.5 pt-2">
//               <button
//                 disabled={isDeleting}
//                 onClick={() => setDeletingCourseId(null)}
//                 className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 disabled={isDeleting}
//                 onClick={handleDeleteConfirm}
//                 className="px-3.5 py-2 text-xs font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
//               >
//                 {isDeleting ? "Deleting..." : "Delete Axis"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




import { useState } from "react";
import { Search, LayoutGrid, List, AlertTriangle } from "lucide-react";
import { useAppMutation, useAppQuery } from "../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CourseCard from "../../../components/Cards/CourseCard";

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

interface Courses {
  id: string;
  title: string;
  description: string;
  thumbnail: Thumbnail;
  language: Language;
  level: string;
  isPublished: boolean;
  price: string;
  sections: any[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export default function CourseCategory() {
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses = [], isLoading } = useAppQuery<Courses[]>({
    url: "/courses",
    queryKey: ["courses"],
  });

  const { mutate: deleteCourses, isPending: isDeleting } = useAppMutation({
    url: "/courses",
    type: "delete",
    onSuccess: () => {
      toast.success("Course deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setDeletingCourseId(null);
    },
    onError: () => {
      toast.error("Failed to delete the course");
    }
  });

  const handleDeleteConfirm = () => {
    if (deletingCourseId) {
      deleteCourses({ id: deletingCourseId });
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50/30 min-h-screen font-sans antialiased">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Course Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View and manage high-tier courses and modules.
          </p>
        </div>
      </div>

      {/* FILTER & VIEW CONTROLS */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-400 text-slate-800 placeholder-slate-400 bg-slate-50/50"
          />
        </div>

        {/* Layout Toggles */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewType("grid")}
            className={`p-1.5 rounded-lg transition-all ${viewType === "grid" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`p-1.5 rounded-lg transition-all ${viewType === "list" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LOADING STATE & CORE CARDS CONSUMPTION LAYER */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-slate-500 font-medium text-sm">
          Loading courses...
        </div>
      ) : viewType === "grid" ? (
        /* --- DYNAMIC GRID HOOK --- */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewType="grid"
              role="superadmin"
              onDeleteClick={(id) => setDeletingCourseId(id)}
            />
          ))}
        </div>
      ) : (
        /* --- DYNAMIC LIST HOOK --- */
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              viewType="list"
              role="superadmin"
              onDeleteClick={(id) => setDeletingCourseId(id)}
            />
          ))}
        </div>
      )}

      {/* NO RESULTS DISPLAY */}
      {!isLoading && filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
          No matches found for your search query.
        </div>
      )}

      {/* NATIVE DELETE CONFIRMATION MODAL */}
      {deletingCourseId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-xl text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete this course item? This action breaks down schema matrices and cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingCourseId(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-3.5 py-2 text-xs font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm inline-flex items-center gap-1.5"
              >
                {isDeleting ? "Deleting..." : "Delete Axis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}