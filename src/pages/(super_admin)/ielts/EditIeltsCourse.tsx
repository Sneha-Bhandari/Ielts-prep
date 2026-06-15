import { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useIELTSStore } from "../../../store/ielts.store";
import type { IeltsCourse } from "../../../interfaces/ielts.interface";
import { ieltsCourseSchema } from "../../../schema/ieltsSchema";
import { X, Upload, BookOpen, DollarSign, Globe, Layers, AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  course: IeltsCourse;
  onClose: () => void;
}

export default function EditIeltsCourse({ course, onClose }: Props) {
  const updateCourse = useIELTSStore((state) => state.updateCourse);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
  setImagePreview(course.thumbnail?.url || "");
}, [course]);

  // ✅ FIXED INITIAL VALUES (API STRUCTURE)
  const initialValues = {
    title: course.title,
    description: course.description,
    ieltsType: {
      id: typeof course.ieltsType === "object"
        ? course.ieltsType?.id
        : (course as any).type || "Academic",
    },
    isPublished: Boolean(course.isPublished),
    thumbnail: course.thumbnail?.url || "",
    price:
      typeof course.price === "string"
        ? parseFloat(course.price)
        : course.price,
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;

      setImagePreview(base64);
      setFieldValue("thumbnail", base64);
      setFieldValue("thumbnailKey", file.name);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (
    setFieldValue: (field: string, value: any) => void
  ) => {
    setImagePreview("");
    setFieldValue("thumbnail", "");
    setFieldValue("thumbnailKey", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={ieltsCourseSchema}
      onSubmit={(values) => {
        // ✅ FIXED PAYLOAD FOR BACKEND
        const updatedCourse: IeltsCourse = {
          ...course,
          title: values.title,
          description: values.description,
          ieltsType: values.ieltsType,
          isPublished: Boolean(values.isPublished),
          // thumbnail: values.thumbnail,
          price: values.price,
        };

        updateCourse(course.id!, updatedCourse);
        onClose();
      }}
    >
      {({ setFieldValue, isSubmitting }) => (
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-100 overflow-hidden font-sans">

          {/* HEADER (UNCHANGED UI) */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                Modify Course Parameters
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Updating: <span className="font-semibold text-slate-700">
                  {course.title || "Untitled Course"}
                </span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-xl border border-slate-200 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* FORM */}
          <Form className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

            {/* IMAGE SECTION (UNCHANGED UI) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2.5">
                Course Billboard Image
              </label>

              {imagePreview && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(setFieldValue)}
                    className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e, setFieldValue)}
              />

              <label
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer"
              >
                <Upload className="w-5 h-5 text-slate-400" />
                <span className="text-sm font-semibold text-blue-600">
                  {imagePreview ? "Replace image" : "Upload thumbnail"}
                </span>
              </label>
            </div>

            {/* TITLE */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                Course Core Title *
              </label>

              <div className="relative">
                <BookOpen className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <Field
                  name="title"
                  className="w-full pl-11 p-3 border rounded-xl"
                />
              </div>

              <ErrorMessage name="title" component="div" className="text-red-500 text-xs" />
            </div>

            {/* IELTS TYPE FIXED */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                Module Stream Category
              </label>

              <div className="relative">
                <Layers className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <Field
                  name="ieltsType.id"
                  as="select"
                  className="w-full pl-11 p-3 border rounded-xl"
                >
                  <option value="Academic">Academic</option>
                  <option value="GT">GT</option>
                  <option value="UKVI">UKVI</option>
                </Field>
              </div>
            </div>

            {/* STATUS FIXED BOOLEAN */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                Deployment Status
              </label>

              <div className="relative">
                <Globe className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <Field
                  as="select"
                  name="isPublished"
                  className="w-full pl-11 p-3 border rounded-xl"
                  onChange={(e: any) =>
                    setFieldValue("isPublished", e.target.value === "true")
                  }
                >
                  <option value="true">Live / Published</option>
                  <option value="false">Internal Draft</option>
                </Field>
              </div>
            </div>

            {/* PRICE */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                Tuition Rate
              </label>

              <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <Field
                  name="price"
                  type="number"
                  className="w-full pl-11 p-3 border rounded-xl"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">
                Course Overview Summary
              </label>

              <Field
                as="textarea"
                name="description"
                rows={4}
                className="w-full p-3 border rounded-xl"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 border rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl"
              >
                {isSubmitting ? "Saving..." : "Commit Changes"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}