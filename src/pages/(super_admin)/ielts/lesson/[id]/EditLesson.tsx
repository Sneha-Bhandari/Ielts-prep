import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Upload, PlayCircle, Loader2, Heading, Clock, SortAsc, AlertCircle } from "lucide-react";
import axios from "axios";
import JoditEditor from "jodit-react";

import { useAppMutation } from "../../../../../lib/react-query";
import type { Lesson } from "../../../../../interfaces/ielts.interface";
import { lessonSchema } from "../../../../../schema/lesson.schema";

interface EditLessonProps {
  lesson: Lesson;
  onClose: () => void;
}

export default function EditLesson({ lesson, onClose }: EditLessonProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(
    lesson.videoId?.id || null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    lesson.videoId?.url || null
  );
 
  const [isVideoChanged, setIsVideoChanged] = useState(false);

  // Jodit Configuration Option Options
  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: "Input comprehensive text instructions, assignments, or guidelines...",
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'paragraph', 'fontsize', '|',
      'align', 'undo', 'redo', '|',
      'eraser', 'fullsize'
    ],
    height: 220,
  }), []);

  const { mutate: updateLesson, isPending } = useAppMutation({
    url: "/lessons",
    type: "patch",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      onClose();
    },
  });

  const handleVideoUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);

      if (!file.type.startsWith("video/")) {
        setUploadError("Please upload a valid video file format (MP4, WebM, MOV).");
        return;
      }

      const formData = new FormData();
      formData.append("images", file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/fileupload/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setVideoUrl(res.data.url);
      setVideoId(res.data.id);
      setIsVideoChanged(true);
    } catch (err) {
      console.error(err);
      setUploadError("Video processing failed. Please check connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  // UI Component Design Tokens
  const inputContainerStyles = "relative mt-1.5";
  const iconBaseStyles = "absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";
  const labelStyles = "block text-xs font-semibold text-slate-600 tracking-wide uppercase";
  const inputBaseStyles =
    "w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-sm rounded-xl pl-11 pr-4 py-2.5 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/80 transition-all duration-200";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* HEADER PANEL */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Edit Lesson Media</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Lesson ID: {lesson.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <Formik
          initialValues={{
            title: lesson.title || "",
            content: lesson.content || "",
            duration: lesson.duration || "",
            order: lesson.order || 1,
          }}
          validationSchema={lessonSchema}
          onSubmit={(values) => {
            const payload: any = {
              id: lesson.id,
              data: {
                title: values.title,
                content: values.content,
                duration: Number(values.duration),
                order: Number(values.order),
              }
            };

            if (videoId) {
              payload.data.videoId = videoId;
            }

            updateLesson(payload);
          }}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="divide-y divide-slate-100">
              
              <div className="p-6 space-y-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
                
                {/* LESSON TITLE */}
                <div>
                  <label className={labelStyles}>Lesson Title</label>
                  <div className={inputContainerStyles}>
                    <Heading size={16} className={iconBaseStyles} />
                    <Field
                      name="title"
                      placeholder="e.g., Understanding Sentence Completion Tasks"
                      className={`${inputBaseStyles} ${errors.title && touched.title ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : ""}`}
                    />
                  </div>
                  <ErrorMessage name="title" component="p" className="text-xs font-medium text-rose-500 mt-1.5 ml-1" />
                </div>

                {/* CONTENT/TRANSCRIPT RICH TEXT EDITOR */}
                <div>
                  <label className={labelStyles}>Material / Transcript Body</label>
                  <div className="prose max-w-none mt-1.5 Jodit-editor-custom-wrapper">
                    <JoditEditor
                      ref={editorRef}
                      value={values.content}
                      config={editorConfig}
                      onBlur={(newContent) => setFieldValue("content", newContent)}
                      onChange={() => {}} // Keeps input smooth
                    />
                  </div>
                  <ErrorMessage name="content" component="p" className="text-xs font-medium text-rose-500 mt-1.5 ml-1" />
                </div>

                {/* VIDEO ELEMENT STREAM */}
                <div>
                  <label className={labelStyles}>Lecture Streaming Asset</label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoUpload(file);
                    }}
                  />

                  {!videoUrl ? (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className={`mt-1.5 w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all group text-center
                        ${uploading ? "bg-slate-50 border-slate-200 cursor-not-allowed" : "bg-slate-50/50 hover:bg-white border-slate-200 hover:border-indigo-500 cursor-pointer"}`}
                    >
                      {uploading ? (
                        <Loader2 className="animate-spin text-indigo-600" size={28} />
                      ) : (
                        <Upload className="text-slate-400 group-hover:text-indigo-500 transition-colors" size={28} />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {uploading ? "Uploading video element..." : "Click to select local file"}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">MP4, WebM or MOV streams (Max 500MB)</p>
                      </div>
                    </button>
                  ) : (
                    <div className="mt-1.5 border border-slate-200 bg-slate-50 rounded-xl p-3 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                          <PlayCircle size={16} />
                          {isVideoChanged ? "New Video Uploaded" : "Current Video Asset"}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoUrl(null);
                            setVideoId(null);
                            setIsVideoChanged(true);
                          }}
                          className="text-xs font-medium text-rose-600 hover:text-rose-700 underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          Clear & Replace
                        </button>
                      </div>
                      <video 
                        src={videoUrl} 
                        controls 
                        className="w-full rounded-lg bg-black shadow-inner max-h-[180px]" 
                      />
                    </div>
                  )}

                  {uploadError && (
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-rose-500 bg-rose-50/60 border border-rose-100 p-2.5 rounded-xl">
                      <AlertCircle size={14} className="shrink-0" />
                      {uploadError}
                    </div>
                  )}
                </div>

                {/* DURATION & POSITION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className={labelStyles}>Duration (Minutes)</label>
                    <div className={inputContainerStyles}>
                      <Clock size={16} className={iconBaseStyles} />
                      <Field
                        type="number"
                        name="duration"
                        placeholder="e.g., 25"
                        className={`${inputBaseStyles} ${errors.duration && touched.duration ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="duration" component="p" className="text-xs font-medium text-rose-500 mt-1.5 ml-1" />
                  </div>

                  <div>
                    <label className={labelStyles}>Display Order No</label>
                    <div className={inputContainerStyles}>
                      <SortAsc size={16} className={iconBaseStyles} />
                      <Field
                        type="number"
                        name="order"
                        placeholder="1"
                        className={`${inputBaseStyles} ${errors.order && touched.order ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : ""}`}
                      />
                    </div>
                    <ErrorMessage name="order" component="p" className="text-xs font-medium text-rose-500 mt-1.5 ml-1" />
                  </div>
                </div>

              </div>

              {/* ACTION CONTAINER */}
              <div className="px-6 py-4 bg-slate-50 flex flex-row-reverse gap-3">
                <button
                  type="submit"
                  disabled={isPending || uploading}
                  className="w-full sm:w-auto min-w-[120px] inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors duration-150"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Lesson"
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}