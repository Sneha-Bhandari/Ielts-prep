import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { uploadFile } from '../../../../lib/file-upload';
import toast from 'react-hot-toast';

const addRepresentativeSchema = Yup.object({
  name: Yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  contact: Yup.string().matches(/^[0-9]{10}$/, "Contact must be 10 digits").required("Contact is required"),
  designation: Yup.string().required("Designation is required"),
});

interface AddRepresentativeFormProps {
  onSubmit: (values: any) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const AddRepresentativeForm = ({ onSubmit, isLoading, onClose }: AddRepresentativeFormProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{ id: string; url: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setIsUploading(true);
      const uploaded = await uploadFile(file);
      setPreview(uploaded.url);
      setUploadedFile(uploaded); 
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload file');
      setPreview(null);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemoveFile = () => {
    setPreview(null);
    setUploadedFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    onSubmit({ 
      ...values, 
      proofDocumentFile: uploadedFile 
    });
    setSubmitting(false);
  };

  const isImage = (url: string) => {
    return url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url?.startsWith('blob:');
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Add Company Representative</h3>
            <p className="text-sm text-slate-500">Fill in the details to add a contact person</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Formik
          initialValues={{ name: '', email: '', contact: '', designation: '' }}
          validationSchema={addRepresentativeSchema}
          onSubmit={handleSubmit}
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
                    placeholder="Enter full name" 
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
                    placeholder="representative@example.com" 
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
                    placeholder="9876543210" 
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
                    placeholder="e.g., Manager" 
                    disabled={isLoading} 
                  />
                  <ErrorMessage name="designation" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Proof Document</label>
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
                          onClick={handleRemoveFile} 
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
                              <span>Click to upload</span>
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

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading || isSubmitting || isUploading} 
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading || isSubmitting ? 'Adding...' : 'Add Representative'}
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