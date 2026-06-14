import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Upload, Loader2, Play, Trash2, Video, Clock, Hash, AlignLeft, Edit3 } from "lucide-react";
import { lessonSchema } from "../../../schema/lesson.schema";
import type { LessonFormData } from "../../../schema/lesson.schema";
import type { Lesson } from "../../../interfaces/ielts.interface";

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormData) => void;
  initialValues: Lesson;
}

export default function EditLessonModal({ isOpen, onClose, onSubmit, initialValues }: EditLessonModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const formValues: LessonFormData = {
    section: initialValues.section,
    title: initialValues.title,
    content: initialValues.content || "",
    video_url: initialValues.video_url || "",
    video_url_key: initialValues.video_url_key || "",
    duration: initialValues.duration || 0,
    order_no: initialValues.order_no,
  };

  const uploadVideoToCloud = async (file: File): Promise<{ url: string; key: string }> => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        const fakeUrl = URL.createObjectURL(file);
        const fakeKey = `video_${Date.now()}_${file.name}`;
        resolve({ url: fakeUrl, key: fakeKey });
      }, 2000);
    });
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file');
      return;
    }

    setUploadingVideo(true);
    setUploadProgress(0);

    try {
      const { url, key } = await uploadVideoToCloud(file);
      setFieldValue('video_url', url);
      setFieldValue('video_url_key', key);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploadingVideo(false);
      setUploadProgress(0);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 antialiased font-sans">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200/60 flex flex-col max-h-[85vh] overflow-hidden transform transition-all duration-300">
        <Formik
          enableReinitialize
          initialValues={formValues}
          validationSchema={lessonSchema}
          onSubmit={(values, { resetForm }) => {
            onSubmit(values);
            resetForm();
            onClose();
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="flex flex-col h-full overflow-hidden">
              {/* Refined Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                    <Edit3 className="w-3 h-3" /> Configuration Editor
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Edit Lesson</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update curriculum assets and metadata.</p>
                </div>
                <button type="button" onClick={onClose} className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 text-xs">Lesson Title <span className="text-rose-500">*</span></label>
                  <Field name="title" className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-indigo-100 focus:border-indigo-600 font-medium" />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <AlignLeft size={13} className="text-slate-400" /> Description
                  </label>
                  <Field as="textarea" rows={3} name="content" className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all resize-none font-medium leading-relaxed" />
                </div>

                {/* Video Section */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <Video size={13} className="text-slate-400" /> Media Attachment <span className="text-rose-500">*</span>
                  </label>
                  
                  {!values.video_url ? (
                    <div className="border border-dashed border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 hover:border-indigo-300 rounded-xl p-6 text-center transition-all cursor-pointer">
                      <input ref={fileInputRef} type="file" accept="video/*" onChange={(e) => handleVideoUpload(e, setFieldValue)} className="hidden" id="edit-video" />
                      <label htmlFor="edit-video" className="cursor-pointer">
                        {uploadingVideo ? <Loader2 className="mx-auto animate-spin text-indigo-600" /> : <Upload className="mx-auto text-slate-400" />}
                        <p className="text-xs font-bold text-slate-700 mt-2">Select new video file</p>
                      </label>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100"><Play size={11} fill="currentColor" /></div>
                          <span className="text-xs font-bold text-slate-900">Current Video Active</span>
                        </div>
                        <button type="button" onClick={() => setFieldValue('video_url', '')} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg"><Trash2 size={13} /></button>
                      </div>
                      <video src={values.video_url} controls className="w-full aspect-video bg-slate-950 p-1" />
                    </div>
                  )}
                </div>

                {/* Grid Fields */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 text-xs"><Clock size={12} className="inline mr-1" /> Duration (mins)</label>
                    <Field type="number" name="duration" className="w-full px-3 py-2.5 border rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 font-semibold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 text-xs"><Hash size={12} className="inline mr-1" /> Order Position</label>
                    <Field type="number" name="order_no" className="w-full px-3 py-2.5 border rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 font-semibold" />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0 bg-slate-50/50">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-200/80 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 text-xs transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting || uploadingVideo} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm disabled:opacity-50 text-xs transition-all">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}