import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Upload, Loader2, Play, Trash2, Video, Clock, Hash, AlignLeft, Sparkles } from "lucide-react";
import { lessonSchema } from "../../../schema/lesson.schema";
import type { LessonFormData } from "../../../schema/lesson.schema";

interface AddLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LessonFormData) => void;
  nextOrderNo: number;
  sectionId: string;
}

export default function AddLessonModal({ isOpen, onClose, onSubmit, nextOrderNo, sectionId }: AddLessonModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const initialValues: LessonFormData = {
    section: sectionId,
    title: "",
    content: "",
    video_url: "",
    video_url_key: "",
    duration: 0,
    order_no: nextOrderNo,
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

    if (file.size > 500 * 1024 * 1024) {
      alert('Video file size should be less than 500MB');
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

  const handleRemoveVideo = (setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('video_url', '');
    setFieldValue('video_url_key', '');
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 antialiased font-sans">
      {/* Backdrop Backdrop with dynamic fade effect */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container Card */}
      <div className="relative bg-white rounded-2xl w-full max-w-xl shadow-xl border border-slate-200/60 flex flex-col max-h-[85vh] overflow-hidden transform transition-all duration-300">
        <Formik
          enableReinitialize
          initialValues={initialValues}
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
                    <Sparkles className="w-3 h-3" /> Content Composer
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Add New Lesson</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Populate course details to extend your syllabus section materials.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Container Form Body */}
              <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1 text-xs">
                
                {/* Title Field Element */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 text-xs">
                    Lesson Title <span className="text-rose-500">*</span>
                  </label>
                  <Field
                    name="title"
                    type="text"
                    placeholder="e.g., Introduction to IELTS Academic Framework"
                    className="w-full px-3.5 py-2.5 text-xs border rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-indigo-100 focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 font-medium"
                  />
                  <ErrorMessage name="title">
                    {(msg) => <p className="text-[11px] text-rose-600 font-medium pl-0.5">{msg}</p>}
                  </ErrorMessage>
                </div>

                {/* Content Field Element */}
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <AlignLeft size={13} className="text-slate-400" /> Description / Content Summary
                  </label>
                  <Field
                    as="textarea"
                    rows={3}
                    name="content"
                    placeholder="Provide detailed instruction summaries, assignment definitions, or specific video notes..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all resize-none text-slate-900 placeholder:text-slate-400 font-medium leading-relaxed"
                  />
                </div>

                {/* Video Media Area Wrapper */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                    <Video size={13} className="text-slate-400" />
                    Lecture Media Attachment <span className="text-rose-500">*</span>
                  </label>
                  
                  {!values.video_url ? (
                    <div className="border border-dashed border-slate-200 bg-slate-50/40 hover:bg-slate-50/80 hover:border-indigo-300 rounded-xl p-6 text-center transition-all relative group">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleVideoUpload(e, setFieldValue)}
                        className="hidden"
                        id="video-upload-add"
                        disabled={uploadingVideo}
                      />
                      <label htmlFor="video-upload-add" className="cursor-pointer block space-y-2">
                        {uploadingVideo ? (
                          <div className="py-2 space-y-3 max-w-xs mx-auto">
                            <Loader2 size={20} className="mx-auto text-indigo-600 animate-spin" />
                            <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold">
                              Uploading video stream... {uploadProgress}%
                            </p>
                          </div>
                        ) : (
                          <div className="py-1">
                            <Upload size={24} className="mx-auto text-slate-400 group-hover:text-indigo-600 mb-2 transition-colors" />
                            <p className="text-xs font-bold text-slate-700 mb-0.5">
                              Click to select educational video asset
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              Supports MP4, WebM, or OGG standards up to 500MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                      <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 text-emerald-600 border border-emerald-100">
                            <Play size={11} fill="currentColor" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">Video Track Loaded</p>
                            <p className="text-[10px] text-slate-400 font-mono font-medium truncate max-w-[280px]">
                              {values.video_url_key}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveVideo(setFieldValue)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      {values.video_url && (
                        <div className="p-2 bg-slate-950 flex justify-center aspect-video max-h-[160px]">
                          <video
                            src={values.video_url}
                            controls
                            className="h-full max-w-full object-contain rounded-md"
                          >
                            Your browser does not support HTML5 video tags.
                          </video>
                        </div>
                      )}
                    </div>
                  )}
                  <ErrorMessage name="video_url">
                    {(msg) => <p className="text-[11px] text-rose-600 font-medium pl-0.5">{msg}</p>}
                  </ErrorMessage>
                </div>

                {/* Metrics Meta Field Dual Row */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      Duration <span className="text-rose-500">*</span> <span className="text-slate-400 font-normal text-[11px]">(minutes)</span>
                    </label>
                    <Field
                      type="number"
                      name="duration"
                      placeholder="0"
                      min="1"
                      className="w-full px-3 py-2.5 border rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-indigo-100 focus:border-indigo-600 text-slate-900 font-semibold"
                    />
                    <ErrorMessage name="duration">
                      {(msg) => <p className="text-[11px] text-rose-600 font-medium pl-0.5">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-semibold text-slate-700 text-xs flex items-center gap-1">
                      <Hash size={12} className="text-slate-400" />
                      Syllabus Index Position <span className="text-rose-500">*</span>
                    </label>
                    <Field
                      type="number"
                      name="order_no"
                      placeholder="1"
                      min="1"
                      className="w-full px-3 py-2.5 border rounded-xl bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition-all border-slate-200 focus:ring-indigo-100 focus:border-indigo-600 text-slate-900 font-semibold"
                    />
                    <ErrorMessage name="order_no">
                      {(msg) => <p className="text-[11px] text-rose-600 font-medium pl-0.5">{msg}</p>}
                    </ErrorMessage>
                  </div>
                </div>
              </div>

              {/* Action Sheet Footer Controls */}
              <div className="px-6 py-4 border-t border-slate-100 flex gap-3 shrink-0 bg-slate-50/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-slate-200/80 text-slate-600 font-semibold rounded-xl hover:bg-slate-100 active:scale-[0.99] transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingVideo}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition-all text-xs"
                >
                  {isSubmitting ? "Creating..." : "Create Lesson"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}