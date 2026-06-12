import { useState } from "react";
import { useIELTSStore } from "../../../store/ielts.store";
import * as yup from "yup";
import type { CourseFormData, IeltsCourse, Lesson } from "../../../interfaces/ielts.interface";
import { courseSchema } from "../../../schema/ieltsSchema";
import { useNavigate } from "react-router-dom";

export default function IeltsDashboard() {
const navigate = useNavigate();

//   const [courses, setCourses] = useState<IeltsCourse[]>([]);
const courses = useIELTSStore((state) => state.courses);

const addCourse = useIELTSStore(
  (state) => state.addCourse
);

const updateCourse = useIELTSStore(
  (state) => state.updateCourse
);

const deleteCourseStore = useIELTSStore(
  (state) => state.deleteCourse
);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showDraft, setShowDraft] = useState(false);
  const [viewCourse, setViewCourse] = useState<IeltsCourse | null>(null);

  const [form, setForm] = useState<CourseFormData>({
    title: "",
    type: "Academic",
    isPublished: true,
    description: "",
    image: "",
    lessons: [],
  });

 const [lesson, setLesson] = useState<Partial<Lesson>>({
  section: "",
  title: "",
  content: "",
  video_url: "",
  video_url_key: "",
  duration: 0,
  order_no: 1,
});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "isPublished") {
      setForm({ ...form, isPublished: value === "true" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  const resetForm = () => {
    setForm({
      title: "",
      type: "Academic",
      isPublished: true,
      description: "",
      image: "",
      lessons: [],
    });
    setLesson({ section: "", title: "" });
    setEditId(null);
    setErrors({});
    setOpen(false);
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await courseSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (await validateForm()) {
//       if (editId !== null) {
//         setCourses(prev => prev.map(c => c.id === editId ? { ...form, id: editId } : c));
//       } else {
//         setCourses([...courses, { ...form, id: Date.now() }]);
//       }
//       resetForm();
//     }
//   };

//   const handleDelete = (id: number) => {
//     if (confirm("Are you sure?")) {
//       setCourses(courses.filter(c => c.id !== id));
//     }
//   };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isValid = await validateForm();

  if (!isValid) return;

  const courseData: IeltsCourse = {
    ...form,
    id: editId ?? Date.now(),
  };

  if (editId !== null) {
    updateCourse(editId, courseData);
  } else {
    addCourse(courseData);
  }

  resetForm();
};



const handleDelete = (id: number) => {
  if (confirm("Are you sure?")) {
    deleteCourseStore(id);
  }
};
const handleEdit = (course: IeltsCourse) => {
  setForm({
    title: course.title,
    type: course.type,
    isPublished: course.isPublished,
    description: course.description,
    image: course.image,
    lessons: course.lessons,
  });

  setEditId(course.id);
  setOpen(true);
};

  const publishedCourses = courses.filter(c => c.isPublished);
  const draftCourses = courses.filter(c => !c.isPublished);

  // Determine which courses to display based on toggle
  const displayedCourses = showDraft ? draftCourses : publishedCourses;
  const emptyMessage = showDraft 
    ? "No draft courses available." 
    : "No published courses available.";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">IELTS Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage, structure, and organize your course materials.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDraft(!showDraft)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 shadow-sm transition-colors"
            >
              {showDraft ? "Show Published" : "Show Drafts"}
            </button>
            <button
              onClick={() => setOpen(true)}
              className="bg-brand-footer-left    font-aeonik text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              + Add Course
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total Courses</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">{courses.length}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Published</div>
            <div className="text-3xl font-bold text-green-600 mt-1">{publishedCourses.length}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Drafts</div>
            <div className="text-3xl font-bold text-amber-600 mt-1">{draftCourses.length}</div>
          </div>
        </div>

        {/* Courses Grid - Always uses cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 px-4">
              <p className="text-gray-500 font-medium">{emptyMessage}</p>
              <button 
                onClick={() => setOpen(true)} 
                className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block"
              >
                Create one now →
              </button>
            </div>
          ) : (
            displayedCourses.map(c => (
              <div 
                key={c.id} 
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg leading-snug line-clamp-2">{c.title}</h3>
                    <span className={`shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      c.isPublished 
                        ? 'bg-green-50 text-green-800 border-green-100' 
                        : 'bg-amber-50 text-amber-800 border-amber-100'
                    }`}>
                      {c.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <span className="inline-block text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                    {c.type}
                  </span>
                  <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                    {c.description || "No description provided."}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <span>📚</span>
                    <span>{c.lessons.length} {c.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
                  </div>
                </div>
                <div className="flex gap-4 border-t border-gray-100 mt-5 pt-3.5 text-sm font-medium">
                  <button 
                    // onClick={() => setViewCourse(c)} 
                    onClick={() => navigate(`/ielts/course/${c.id}`)}

                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => handleEdit(c)} 
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(c.id)} 
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 ml-auto"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {viewCourse && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center p-4 z-50 transition-opacity" onClick={() => setViewCourse(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-700 rounded mb-2">{viewCourse.type}</span>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{viewCourse.title}</h2>
              </div>
              <button onClick={() => setViewCourse(null)} className="text-gray-400 hover:text-gray-600 text-xl font-semibold leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {viewCourse.image && (
                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video w-full">
                  <img src={viewCourse.image} alt={viewCourse.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{viewCourse.description || "No description provided for this course."}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Syllabus Structure ({viewCourse.lessons.length})</h4>
                {viewCourse.lessons.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No curriculum units specified yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {viewCourse.lessons.map((l, i) => (
                      <li key={i} className="p-3 text-sm flex gap-3 hover:bg-white transition-colors">
                        <span className="font-semibold text-blue-600 shrink-0">{l.section}</span>
                        <span className="text-gray-700">{l.title}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewCourse(null)} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Dynamic Modal Form */}
      {open && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={resetForm}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-8 flex flex-col overflow-hidden transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Update Course Details" : "Create New Course"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-xl font-semibold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Ultimate Listening Intensive"
                  className={`w-full p-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-blue-500'}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module Category</label>
                  <select name="type" value={form.type} onChange={handleChange} className="w-full p-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="Academic">Academic</option>
                    <option value="GT">General Training (GT)</option>
                    <option value="UKVI">UKVI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility Status</label>
                  <select name="isPublished" value={String(form.isPublished)} onChange={handleChange} className="w-full p-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                    <option value="true">Published</option>
                    <option value="false">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide structured details regarding module layout..."
                  rows={3}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image Source URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/assets/banner.jpg"
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {errors.image && <p className="text-red-500 text-xs mt-1 font-medium">{errors.image}</p>}
              </div>

              

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

