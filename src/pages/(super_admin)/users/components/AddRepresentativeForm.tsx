import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { Upload, X} from 'lucide-react';
import { useState, } from 'react';

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
  const [proofDocumentPreview, setProofDocumentPreview] = useState<string>('');
  const [proofDocumentFile, setProofDocumentFile] = useState<File | null>(null);

  const handleSubmit = (values: any, { resetForm, setSubmitting }: any) => {
    const submitData = { ...values };
    if (proofDocumentFile) {
      submitData.proofDocumentFile = proofDocumentFile;
    }
    onSubmit(submitData);
    resetForm();
    setProofDocumentPreview('');
    setProofDocumentFile(null);
    setSubmitting(false);
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
          {({ setFieldValue, isSubmitting }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <Field name="name" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" placeholder="Enter full name" disabled={isLoading} />
                  <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <Field name="email" type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" placeholder="representative@example.com" disabled={isLoading} />
                  <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
                  <Field name="contact" type="tel" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" placeholder="9876543210" disabled={isLoading} />
                  <ErrorMessage name="contact" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                  <Field name="designation" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" placeholder="e.g., Manager" disabled={isLoading} />
                  <ErrorMessage name="designation" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Proof Document</label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {proofDocumentPreview ? (
                      <div className="relative inline-block">
                        <img src={proofDocumentPreview} alt="Preview" className="h-32 w-auto mx-auto rounded-lg object-cover" />
                        <button type="button" onClick={() => { setProofDocumentFile(null); setProofDocumentPreview(''); setFieldValue('proofDocument', ''); }} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-10 w-10 text-slate-400" />
                        <label className="cursor-pointer text-indigo-600 hover:text-indigo-700">
                          <span>Click to upload</span>
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setProofDocumentFile(file);
                              setProofDocumentPreview(URL.createObjectURL(file));
                              setFieldValue('proofDocument', file);
                            }
                          }} disabled={isLoading} />
                        </label>
                        <p className="text-xs text-slate-500">PNG, JPG, PDF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isLoading || isSubmitting} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {isLoading || isSubmitting ? 'Adding...' : 'Add Representative'}
                </button>
                <button type="button" onClick={onClose} className="flex-1 border border-slate-300 py-2 rounded-lg hover:bg-slate-50">Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};