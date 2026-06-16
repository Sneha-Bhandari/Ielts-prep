import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { Upload, X} from 'lucide-react';
import { useState } from 'react';
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
  const [proofDocumentPreview, setProofDocumentPreview] = useState<string>('');
  const [proofDocumentFile, setProofDocumentFile] = useState<File | null>(null);
  const [removeExistingDoc, setRemoveExistingDoc] = useState(false);

  const currentProofDocUrl = representative.proofDocumentId?.url || null;

  const handleSubmit = (values: any, { setSubmitting }: any) => {
    const submitData = { ...values };
    if (proofDocumentFile) {
      submitData.proofDocumentFile = proofDocumentFile;
    }
    if (removeExistingDoc) {
      submitData.removeProofDocument = true;
    }
    onSubmit(submitData);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Edit Representative</h3>
            <p className="text-sm text-slate-500">Update representative details</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="h-5 w-5" /></button>
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
          {({ setFieldValue, isSubmitting }) => (
            <Form className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <Field name="name" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" disabled={isLoading} />
                  <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <Field name="email" type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" disabled={isLoading} />
                  <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number *</label>
                  <Field name="contact" type="tel" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" disabled={isLoading} />
                  <ErrorMessage name="contact" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation *</label>
                  <Field name="designation" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 border-slate-300" disabled={isLoading} />
                  <ErrorMessage name="designation" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Current Document */}
                {currentProofDocUrl && !removeExistingDoc && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Proof Document</label>
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border">
                      <a href={currentProofDocUrl} target="_blank" className="text-indigo-600 hover:underline">View Current Document</a>
                      <button type="button" onClick={() => setRemoveExistingDoc(true)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload New Document */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {currentProofDocUrl && !removeExistingDoc ? 'Replace Proof Document' : 'Proof Document'}
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {proofDocumentPreview ? (
                      <div className="relative inline-block">
                        <img src={proofDocumentPreview} alt="Preview" className="h-32 w-auto mx-auto rounded-lg" />
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
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={isLoading || isSubmitting} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                  {isLoading || isSubmitting ? 'Updating...' : 'Update Representative'}
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