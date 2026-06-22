import { useMemo, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useQueryClient } from "@tanstack/react-query";
import type { Section } from "../../../../../interfaces/ielts.interface";
import { useAppMutation } from "../../../../../lib/react-query";
import JoditEditor from "jodit-react";
import { sectionSchema } from "../../../../../schema/section.schema";

interface EditSectionProps {
  section: Section;
  onClose: () => void;
}

export default function EditSection({
  section,
  onClose,
}: EditSectionProps) {
  const queryClient = useQueryClient();
  const editorRef = useRef(null);

  // Jodit Editor configuration options
  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: "Brief summary of what this section covers...",
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'paragraph', 'fontsize', '|',
      'align', 'undo', 'redo', '|',
      'eraser', 'fullsize'
    ],
    height: 250,
  }), []);

  const { mutate: updateSection, isPending } = useAppMutation({
    url: "/sections",
    type: "patch",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["ielts"] });
      onClose();
    },
    onError: (err) => {
      console.error("Update Section Error:", err);
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto p-2 text-slate-800 antialiased">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Edit Section
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Modify the properties and sequence of this curriculum block.
        </p>
      </div>

      <Formik
        initialValues={{
          title: section.title || "",
          description: section.description || "",
          orderNo: section.orderNo || 1,
        }}
        validationSchema={sectionSchema}
        enableReinitialize
        onSubmit={(values) => {
          const payload = {
            id: section.id,
            title: values.title,
            description: values.description,
            orderNo: Number(values.orderNo),
            // IMPORTANT: backend expects string
            ielts: section.ielts?.id || section.ielts,
          };

          console.log("UPDATE PAYLOAD:", payload);

          updateSection({
            id: section.id,
            data: payload,
          });
        }}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-5">

            {/* SECTION TITLE */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-semibold text-slate-700">
                Section Title
              </label>
              <Field
                id="title"
                name="title"
                placeholder="Section Title"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  touched.title && errors.title
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-rose-600 text-xs font-medium pl-1 animate-in fade-in slide-in-from-top-1 duration-200"
              />
            </div>

            {/* DESCRIPTION WITH JODIT EDITOR */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700">
                Description
              </label>
              <div className="prose max-w-none JSON-editor-override">
                <JoditEditor
                  ref={editorRef}
                  value={values.description}
                  config={editorConfig}
                  onBlur={(newContent) => setFieldValue("description", newContent)}
                  onChange={() => {}} // Satisfies typing definitions smoothly
                />
              </div>
              <ErrorMessage
                name="description"
                component="div"
                className="text-rose-600 text-xs font-medium pl-1 animate-in fade-in slide-in-from-top-1 duration-200"
              />
            </div>

            {/* ORDER NO */}
            <div className="space-y-1.5">
              <label htmlFor="orderNo" className="text-sm font-semibold text-slate-700">
                Display Order Position
              </label>
              <Field
                id="orderNo"
                type="number"
                name="orderNo"
                min="1"
                className={`w-full border rounded-xl px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 transition-all max-w-[140px] ${
                  touched.orderNo && errors.orderNo
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                }`}
              />
              <ErrorMessage
                name="orderNo"
                component="div"
                className="text-rose-600 text-xs font-medium pl-1 animate-in fade-in slide-in-from-top-1 duration-200"
              />
            </div>

            {/* FORM ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors duration-150"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending || isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors duration-150 flex items-center justify-center min-w-[130px] shadow-sm shadow-indigo-100"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving Changes...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}