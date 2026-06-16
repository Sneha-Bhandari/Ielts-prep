import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { uploadFile } from '../../../../lib/file-upload';
import toast from 'react-hot-toast';
import type { CompanyRepresentative } from '../../../../interfaces/admin.interface';

const editRepresentativeSchema = Yup.object({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  contact: Yup.string().matches(/^[0-9]{10}$/, "Contact must be 10 digits").required("Contact is required"),
  designation: Yup.string().required("Designation is required"),
});

interface EditRepresentativeModalProps {
  representative: CompanyRepresentative;
  onSubmit: (values: any) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const EditRepresentativeModal = ({ representative, onSubmit, isLoading, onClose }: EditRepresentativeModalProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ id: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the proof document URL - check both possible locations
  const getProofDocumentUrl = () => {
    // Check if proofDocument exists (from API response)
    if ((representative as any).proofDocument?.url) {
      console.log('Found proofDocument.url:', (representative as any).proofDocument.url);
      return (representative as any).proofDocument.url;
    }
    // Check if proofDocumentId exists and has url property
    if ((representative as any).proofDocumentId?.url) {
      console.log('Found proofDocumentId.url:', (representative as any).proofDocumentId.url);
      return (representative as any).proofDocumentId.url;
    }
    // Check if proofDocumentId is a string
    if (typeof representative.proofDocumentId === 'string' && representative.proofDocumentId) {
      console.log('Found proofDocumentId as string:', representative.proofDocumentId);
      // If it's a string ID, you might need to convert it to a URL
      return (representative as any).proofDocumentId; // Or use getFileUrl(representative.proofDocumentId)
    }
    console.log('No proof document found');
    return null;
  };

  const currentProofDocUrl = getProofDocumentUrl();

  // Log the representative data to debug
  console.log('Representative data:', representative);
  console.log('Current proof URL:', currentProofDocUrl);

  // Set initial preview from existing document when modal opens
  useEffect(() => {
    if (currentProofDocUrl) {
      setPreview(currentProofDocUrl);
    } else {
      setPreview(null);
    }
    // Reset uploaded file when representative changes
    setUploadedFile(null);
  }, [representative, currentProofDocUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setFieldValue('proofDocument', file);

    try {
      setIsUploading(true);
      const uploaded = await uploadFile(file);
      setPreview(uploaded.url);
      setUploadedFile(uploaded);
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
      // Revert to original document on error
      setPreview(currentProofDocUrl);
      setUploadedFile(null);
      setFieldValue('proofDocument', null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemoveFile = (setFieldValue: any) => {
    setPreview(null);
    setUploadedFile(null);
    setFieldValue('proofDocument', null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const submitData = { ...values };
    if (uploadedFile) {
      submitData.proofDocumentFile = uploadedFile;
    }
    onSubmit(submitData);
    setSubmitting(false);
  };

  const isImage = (url: string) => {
    if (!url) return false;
    return url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url?.startsWith('blob:');
  };

  // Check if there's a current document (existing and no new file uploaded)
  const hasCurrentDocument = currentProofDocUrl && !uploadedFile && !preview;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Representative</h3>
            <p className="text-sm text-slate-500">Update representative details</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          initialValues={{
            name: representative.name || '',
            email: representative.email || '',
            contact: representative.contact || '',
            designation: representative.designation || '',
          }}
          validationSchema={editRepresentativeSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, isSubmitting, errors, touched }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <Field 
                    name="name" 
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      touched.name && errors.name ? 'border-red-500' : 'border-slate-300'
                    }`}
                    disabled={isLoading} 
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <Field 
                    name="email" 
                    type="email" 
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      touched.email && errors.email ? 'border-red-500' : 'border-slate-300'
                    }`}
                    disabled={isLoading} 
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
                  <Field 
                    name="contact" 
                    type="tel" 
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      touched.contact && errors.contact ? 'border-red-500' : 'border-slate-300'
                    }`}
                    disabled={isLoading} 
                  />
                  <ErrorMessage name="contact" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                  <Field 
                    name="designation" 
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                      touched.designation && errors.designation ? 'border-red-500' : 'border-slate-300'
                    }`}
                    disabled={isLoading} 
                  />
                  <ErrorMessage name="designation" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {hasCurrentDocument ? 'Current Proof Document' : 'Proof Document'}
                  </label>
                  
                  {/* Show current document if exists and no new file uploaded */}
                  {hasCurrentDocument && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                      {isImage(currentProofDocUrl) ? (
                        <img src={currentProofDocUrl} alt="Current Document" className="h-20 w-auto rounded-lg object-cover" />
                      ) : (
                        <a href={currentProofDocUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          View Current Document
                        </a>
                      )}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFile(setFieldValue)} 
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                    {preview ? (
                      <div className="relative inline-block">
                        {isImage(preview) ? (
                          <img src={preview} alt="Preview" className="h-32 w-auto mx-auto rounded-lg object-cover" />
                        ) : (
                          <div className="h-32 w-32 mx-auto flex flex-col items-center justify-center bg-slate-100 rounded-lg">
                            <FileText className="h-12 w-12 text-slate-500" />
                            <span className="text-xs text-slate-500 mt-1">Document</span>
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
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                            <Upload className="mx-auto h-10 w-10 text-slate-400" />
                            <label className="cursor-pointer text-indigo-600 hover:text-indigo-700">
                              <span>{hasCurrentDocument ? 'Replace Document' : 'Click to upload'}</span>
                              <input 
                                ref={inputRef}
                                type="file" 
                                className="hidden" 
                                accept="image/*,.pdf" 
                                onChange={(e) => handleFileSelect(e, setFieldValue)}
                                disabled={isLoading || isUploading} 
                              />
                            </label>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG, PDF up to 5MB</p>
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
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading || isSubmitting ? 'Updating...' : 'Update Representative'}
                </button>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="flex-1 border border-slate-300 py-2 rounded-lg hover:bg-slate-50 transition-colors"
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