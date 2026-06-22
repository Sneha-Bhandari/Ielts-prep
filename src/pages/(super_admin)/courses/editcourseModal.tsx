import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppMutation, useAppQuery } from "../../../lib/react-query";
import { courseSchema } from "../../../schema/courseSchema";
import { toast } from "react-toastify";
import {
  Globe,
  GraduationCap,
  DollarSign,
  Image as ImageIcon,
  AlignLeft,
  Type,
  UploadCloud,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

// 1. COMPONENT INBOUND DATA INTERFACES
interface Thumbnail {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  size: number;
  type: string;
}

interface Language {
  id: string | number;
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
  id: string;
  title: string;
  description: string;
  thumbnail?: Thumbnail;
  language?: Language;
  level: string;
  isPublished?: boolean;
  price?: string;
  sections: CourseSection[];
}

interface EditCourseModalProps {
  entity: GenericEntity;
  isIelts: boolean;
  onClose: () => void;
}

export default function EditCourseModal({ entity, isIelts, onClose }: EditCourseModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(entity.thumbnail?.url || null);
  const [dragActive, setDragActive] = useState(false);
  const queryClient = useQueryClient();

  const entityTypeLabel = isIelts ? "IELTS Group" : "Course";
  const mutationUrl = isIelts ? `/ielts/${entity.id}` : `/courses/${entity.id}`;
  const queryKey = isIelts ? ["ielts-list"] : ["courses"];

  // Language Query
  const { data: languagesData, isLoading: loadingLanguages } = useAppQuery<Language[]>({
    url: "/languages",
    queryKey: ["languages"],
  });
  const languages = Array.isArray(languagesData) ? languagesData : [];

  // Update/Put Request Hook Setup
  const { mutate, isPending: isUpdating } = useAppMutation({
    url: mutationUrl,
    type: "put", // PUT request structure for modifying existing items
    onSuccess: () => {
      toast.success(`${entityTypeLabel} configuration synchronized! 🎉`);
      queryClient.invalidateQueries({ queryKey });
      onClose();
    },
    onError: (error) => {
      console.error(`Failed to update ${entityTypeLabel}:`, error);
      toast.error(`An error occurred while modifying the ${entityTypeLabel.toLowerCase()}.`);
    },
  });

  // Map incoming database values safely to local state variables
  const initialValues = {
    title: entity.title || "",
    description: entity.description || "",
    level: entity.level || "Beginner",
    price: entity.price ? String(entity.price) : "",
    languageid: entity.language?.id ? String(entity.language.id) : languages.length > 0 ? String(languages[0].id) : "",
    isPublished: !!entity.isPublished,
    thumbnailid: entity.thumbnail?.id || "",
  };

  const processImageFile = async (
    file: File,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.warn("Image file is too large. Must be under 5MB.");
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("images", file);

    try {
      const baseURL = import.meta.env.VITE_API_URL || "";
      const response = await axios.post(`${baseURL}/fileupload/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedId = response.data?.id || response.data?.thumbnailid;

      if (uploadedId) {
        setFieldValue("thumbnailid", uploadedId);
        toast.success("Thumbnail uploaded successfully!");
      } else {
        throw new Error("No thumbnail identifier parsed from server response.");
      }
    } catch (error) {
      console.error("Image file streaming failed:", error);
      toast.error("Failed to upload the course thumbnail. Please try again.");
      setPreviewUrl(entity.thumbnail?.url || null);
      setFieldValue("thumbnailid", entity.thumbnail?.id || "");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) processImageFile(file, setFieldValue);
  };

  const removeUploadedImage = (setFieldValue: (field: string, value: any) => void) => {
    setPreviewUrl(null);
    setFieldValue("thumbnailid", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Thumbnail removed.");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, setFieldValue: (field: string, value: any) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processImageFile(file, setFieldValue);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white max-w-2xl w-full rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Modify {entityTypeLabel} Framework</h3>
            <p className="text-xs text-slate-400 mt-0.5">Alter parameters across runtime variables safely.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Elements Container */}
        <div className="overflow-y-auto py-4 pr-1 flex-1">
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={courseSchema}
            onSubmit={(values) => {
              const submissionPayload = {
                ...values,
                price: Number(values.price) || 0,
                languageid: String(values.languageid),
              };
              mutate({ data: submissionPayload });
            }}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form className="space-y-5 text-slate-700">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-slate-400" /> Matrix Title <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="title"
                    placeholder="e.g., IELTS Academic Masterclass"
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                      touched.title && errors.title
                        ? "border-red-300 focus:border-red-400 bg-red-50/10"
                        : "border-slate-200 focus:border-slate-400"
                    }`}
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                    {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                  </ErrorMessage>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Content Summary Breakdown <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={3}
                    placeholder="Provide summary structural descriptors..."
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none ${
                      touched.description && errors.description
                        ? "border-red-300 focus:border-red-400 bg-red-50/10"
                        : "border-slate-200 focus:border-slate-400"
                    }`}
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                    {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                  </ErrorMessage>
                </div>

                {/* Row Array Grid mapping */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Level Option mapping */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Level
                    </label>
                    <Field
                      as="select"
                      name="level"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-slate-400 transition-all cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </Field>
                  </div>

                  {/* Language Selector mapping */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-400" /> Language Axis
                    </label>
                    <Field
                      as="select"
                      name="languageid"
                      disabled={loadingLanguages}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-slate-400 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {loadingLanguages ? (
                        <option value="">Loading items...</option>
                      ) : languages.length === 0 ? (
                        <option value="">None Mapped</option>
                      ) : (
                        <>
                          <option value="">Select Language</option>
                          {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                              {lang.name}
                            </option>
                          ))}
                        </>
                      )}
                    </Field>
                    <ErrorMessage name="languageid" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                      {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                    </ErrorMessage>
                  </div>

                  {/* Cost Allocation Mapping */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price (NPR) <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="number"
                      name="price"
                      placeholder="5000"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("price", e.target.value ? Number(e.target.value) : "")
                      }
                      className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                        touched.price && errors.price
                          ? "border-red-300 focus:border-red-400 bg-red-50/10"
                          : "border-slate-200 focus:border-slate-400"
                      }`}
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                      {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                    </ErrorMessage>
                  </div>
                </div>

                {/* File Attachment Drag Strip */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Course Image Thumbnail
                  </label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, setFieldValue)}
                    accept="image/*"
                    className="hidden"
                  />

                  {!previewUrl ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={(e) => handleDrop(e, setFieldValue)}
                      onClick={() => !uploading && fileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                        dragActive
                          ? "border-indigo-500 bg-indigo-50/40"
                          : touched.thumbnailid && errors.thumbnailid
                          ? "border-red-300 bg-red-50/5"
                          : "border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="p-2 rounded-full bg-white border border-slate-100 text-slate-400 shadow-sm">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-slate-500">
                        <span className="text-slate-800 font-medium">Upload new graphic file</span> or drop asset
                      </div>
                      <p className="text-[10px] text-slate-400">PNG, JPG formats supported up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900/5 h-32 flex items-center justify-center">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-contain opacity-90" />

                      {uploading ? (
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white">
                          <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
                          <span className="text-xs font-medium tracking-wide">Syncing image payload...</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeUploadedImage(setFieldValue)}
                          className="absolute top-2 right-2 p-1 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                  <ErrorMessage name="thumbnailid" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                    {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                  </ErrorMessage>
                </div>

                {/* Visible Matrix Status Module Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/50 mt-2">
                  <div>
                    <span className="block text-sm font-medium text-slate-800">Publish Immediately</span>
                    <span className="block text-xs text-slate-400">Toggle instant public access metrics for students.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={values.isPublished}
                      onChange={(e) => setFieldValue("isPublished", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                  </label>
                </div>

                {/* Trigger Control Strip Footer */}
                <div className="flex gap-3 pt-2 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating || uploading}
                    className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Configuration...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Apply Alterations
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

      </div>
    </div>
  );
}