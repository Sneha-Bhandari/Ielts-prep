import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { uploadFile } from "../../../../lib/file-upload";
import toast from "react-hot-toast";
import type { CompanyRepresentative } from "../../../../interfaces/admin.interface";

const editRepresentativeSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  contact: Yup.string()
    .matches(/^[0-9]{10}$/, "Contact must be 10 digits")
    .required("Contact is required"),
  designation: Yup.string().required("Designation is required"),
});

interface EditRepresentativeModalProps {
  representative: CompanyRepresentative;
  onSubmit: (values: any) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const EditRepresentativeModal = ({
  representative,
  onSubmit,
  isLoading,
  onClose,
}: EditRepresentativeModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [removeExisting, setRemoveExisting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to safely extract proof document ID as string
  const getProofDocumentIdAsString = (): string | null => {
    if (!representative.proofDocumentId) return null;
    
    // If it's already a string, return it
    if (typeof representative.proofDocumentId === 'string') {
      return representative.proofDocumentId;
    }
    
    // If it's an object with an id property
    if (typeof representative.proofDocumentId === 'object') {
      const obj = representative.proofDocumentId as any;
      if (obj.id && typeof obj.id === 'string') {
        return obj.id;
      }
      if (obj._id && typeof obj._id === 'string') {
        return obj._id;
      }
    }
    
    return null;
  };

  // Helper function to safely extract proof document URL
  const getProofDocumentUrl = (): string | null => {
    if (!representative.proofDocumentId) return null;
    
    // If it's a string, we can't get a URL from it directly
    if (typeof representative.proofDocumentId === 'string') {
      return null;
    }
    
    // If it's an object with a url property
    if (typeof representative.proofDocumentId === 'object') {
      const obj = representative.proofDocumentId as any;
      if (obj.url && typeof obj.url === 'string') {
        return obj.url;
      }
    }
    
    return null;
  };

  // Check if proofDocumentId is an object (contains document data)
  const isProofDocumentObject = (): boolean => {
    return representative.proofDocumentId !== null && 
           typeof representative.proofDocumentId === 'object';
  };

  const currentProofDocId = getProofDocumentIdAsString();
  const currentProofDocUrl = getProofDocumentUrl();
  const hasProofDocumentObject = isProofDocumentObject();

  // Log for debugging
  console.log("=== EditRepresentativeModal Debug ===");
  console.log("Representative:", representative);
  console.log("proofDocumentId type:", typeof representative.proofDocumentId);
  console.log("proofDocumentId value:", representative.proofDocumentId);
  console.log("Extracted ID:", currentProofDocId);
  console.log("Extracted URL:", currentProofDocUrl);
  console.log("Is object:", hasProofDocumentObject);

  // Set initial preview from existing document when modal opens
  useEffect(() => {
    if (currentProofDocUrl) {
      setPreview(currentProofDocUrl);
    } else {
      setPreview(null);
    }
    setUploadedFile(null);
    setRemoveExisting(false);
  }, [representative, currentProofDocUrl]);

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    try {
      setIsUploading(true);

      const uploaded = await uploadFile(file);

      setPreview(uploaded.url);
      setUploadedFile(uploaded);
      setRemoveExisting(false);

      // Set the field value to the uploaded file ID (string)
      setFieldValue("proofDocumentId", uploaded.id);

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file");
      setPreview(currentProofDocUrl);
      setUploadedFile(null);
      setFieldValue("proofDocumentId", currentProofDocId || "");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemoveFile = (setFieldValue: any) => {
    setPreview(null);
    setUploadedFile(null);
    setRemoveExisting(true);
    setFieldValue("proofDocumentId", null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    let proofDocumentId = null;

    // If we have a newly uploaded file, use its ID (string)
    if (uploadedFile?.id) {
      proofDocumentId = uploadedFile.id;
    }
    // If we're not removing existing and there's a current document ID, keep it
    else if (!removeExisting && currentProofDocId) {
      proofDocumentId = currentProofDocId;
    }
    // Otherwise, it will be null (document removed)

    const submitData = {
      admin: representative.admin,
      name: values.name,
      email: values.email,
      contact: values.contact,
      designation: values.designation,
      proofDocumentId: proofDocumentId, // Always string or null
    };

    console.log("=== FINAL PAYLOAD ===");
    console.log("Submit data:", submitData);
    console.log("proofDocumentId type:", typeof submitData.proofDocumentId);
    console.log("proofDocumentId value:", submitData.proofDocumentId);
    
    onSubmit(submitData);
    setSubmitting(false);
  };

  const isImage = (url: string) => {
    if (!url) return false;
    return (
      url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url?.startsWith("blob:")
    );
  };

  // Check if there's a current document and not removed and no new file uploaded
  const hasCurrentDocument = currentProofDocUrl && !uploadedFile && !removeExisting;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Edit Representative
            </h3>
            <p className="text-sm text-slate-500">
              Update representative details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          initialValues={{
            name: representative.name || "",
            email: representative.email || "",
            contact: representative.contact || "",
            designation: representative.designation || "",
            proofDocumentId: currentProofDocId || "",
          }}
          validationSchema={editRepresentativeSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <Field
                    name="name"
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      touched.name && errors.name
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contact Number *
                  </label>
                  <Field
                    name="contact"
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      touched.contact && errors.contact
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="contact"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Designation *
                  </label>
                  <Field
                    name="designation"
                    className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
                      touched.designation && errors.designation
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                    disabled={isLoading}
                  />
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {hasCurrentDocument
                      ? "Current Proof Document"
                      : "Proof Document"}
                  </label>

                  {/* Show current document if exists and not removed */}
                  {hasCurrentDocument && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between group hover:bg-slate-100 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        {isImage(currentProofDocUrl) ? (
                          <img
                            src={currentProofDocUrl}
                            alt="Current Document"
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-indigo-500" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Current Document
                          </p>
                          <a
                            href={currentProofDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                          >
                            <FileText className="h-3 w-3" />
                            View Document
                          </a>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(setFieldValue)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-all duration-300">
                    {preview && !removeExisting ? (
                      <div className="relative inline-block">
                        {isImage(preview) ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="h-32 w-auto mx-auto rounded-lg object-cover shadow-lg"
                          />
                        ) : (
                          <div className="h-32 w-32 mx-auto flex flex-col items-center justify-center bg-slate-100 rounded-lg">
                            <FileText className="h-12 w-12 text-slate-500" />
                            <span className="text-xs text-slate-500 mt-1">
                              Document
                            </span>
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(setFieldValue)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        {isUploading ? (
                          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mx-auto" />
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                            <label className="cursor-pointer text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
                              <span>
                                {hasCurrentDocument
                                  ? "Replace Document"
                                  : "Click to upload"}
                              </span>
                              <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                  handleFileSelect(e, setFieldValue)
                                }
                                disabled={isLoading || isUploading}
                              />
                            </label>
                            <p className="text-xs text-slate-500 mt-1">
                              PNG, JPG, PDF up to 5MB
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || isUploading}
                  className="flex-1 bg-linear-to-r from-indigo-500 to-indigo-600 text-white py-2.5 rounded-xl hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all duration-300 font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  {isLoading || isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    "Update Representative"
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-2 border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-300 font-medium"
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
};