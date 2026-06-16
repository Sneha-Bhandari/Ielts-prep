import { Formik, Form, Field, ErrorMessage } from 'formik';
import { adminSchema } from '../../../../schema/adminSchema';
import { Loader2, Upload, X, FileText, Building } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Plan } from '../../../../interfaces/admin.interface';
import { uploadFile } from '../../../../lib/file-upload';
import toast, { Toaster } from 'react-hot-toast';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface AdminFormProps {
  onSubmit: (values: any) => Promise<void> | void;
  isLoading: boolean;
  initialValues?: any;
  countries?: Country[];
  plans?: Plan[];
  plansLoading?: boolean;
}

export const AdminForm = ({ onSubmit, isLoading, initialValues, countries = [], plans=[], plansLoading= false }: AdminFormProps) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [registrationDocumentPreview, setRegistrationDocumentPreview] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [activeField, setActiveField] = useState<'logo' | 'document' | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Set preview from initialValues if editing
  useEffect(() => {
    if (initialValues?.companyLogo?.url) {
      setLogoPreview(initialValues.companyLogo.url);
    }
    if (initialValues?.registrationDocument?.url) {
      setRegistrationDocumentPreview(initialValues.registrationDocument.url);
    }
  }, [initialValues]);

  const initialFormValues = {
    country: initialValues?.country || '',
    companyName: initialValues?.companyName || '',
    companyAddress: initialValues?.companyAddress || '',
    email: initialValues?.email || '',
    website: initialValues?.website || '',
    panNo: initialValues?.panNo || '',
    plan: initialValues?.plan?.name || initialValues?.plan || '',
    companyLogo: initialValues?.companyLogo?.id || initialValues?.companyLogo || '',
    registrationDocument: initialValues?.registrationDocument?.id || initialValues?.registrationDocument || '',
    paymentStatus: initialValues?.paymentStatus || 'pending',
    isActive: initialValues?.isActive ?? true,
  };

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      if (registrationDocumentPreview && registrationDocumentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(registrationDocumentPreview);
      }
    };
  }, [logoPreview, registrationDocumentPreview]);

  const handleFileUpload = async (
    file: File,
    setFieldValue: (field: string, value: any) => void,
    fieldName: 'logo' | 'document'
  ) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    
    try {
      if (fieldName === 'logo') {
        setUploadingLogo(true);
        setLogoPreview(previewUrl);
      } else {
        setUploadingDoc(true);
        setRegistrationDocumentPreview(previewUrl);
      }

      const uploadedFile = await uploadFile(file);
      
      if (fieldName === 'logo') {
        setFieldValue('companyLogo', uploadedFile.id);
        toast.success('Logo uploaded successfully!');
      } else {
        setFieldValue('registrationDocument', uploadedFile.id);
        toast.success('Document uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
      if (fieldName === 'logo') {
        setLogoPreview('');
        setFieldValue('companyLogo', '');
      } else {
        setRegistrationDocumentPreview('');
        setFieldValue('registrationDocument', '');
      }
    } finally {
      if (fieldName === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingDoc(false);
      }
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    fieldName: 'logo' | 'document'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file, setFieldValue, fieldName);
    }
  };

  const handleRemoveImage = (
    setFieldValue: (field: string, value: any) => void,
    fieldName: 'logo' | 'document'
  ) => {
    if (fieldName === 'logo') {
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview('');
      setFieldValue('companyLogo', '');
      if (logoInputRef.current) logoInputRef.current.value = '';
      toast.remove('Logo removed');
    } else {
      if (registrationDocumentPreview && registrationDocumentPreview.startsWith('blob:')) {
        URL.revokeObjectURL(registrationDocumentPreview);
      }
      setRegistrationDocumentPreview('');
      setFieldValue('registrationDocument', '');
      if (documentInputRef.current) documentInputRef.current.value = '';
      toast.remove('Document removed');
    }
  };

  const handleDrag = (e: React.DragEvent, field: 'logo' | 'document') => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
      setActiveField(field);
    } else if (e.type === "dragleave") {
      setDragActive(false);
      setActiveField(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, setFieldValue: any, fieldName: 'logo' | 'document') => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setActiveField(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await handleFileUpload(file, setFieldValue, fieldName);
    }
  };

  const handleSubmit = async (values: typeof initialFormValues, { resetForm, setSubmitting }: any) => {
    try {
      await onSubmit(values);
      if (!initialValues) {
        resetForm();
        setRegistrationDocumentPreview('');
        setLogoPreview('');
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const isDragActiveForField = (field: 'logo' | 'document') => {
    return dragActive && activeField === field;
  };

  const isUploading = uploadingLogo || uploadingDoc;

  return (
    <>
      <Toaster position="top-right" />
      <Formik
        initialValues={initialFormValues}
        validationSchema={adminSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, errors, touched, isSubmitting }) => (
          <Form className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-600" />
                Company Registration
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                
                {/* Company Logo Upload - Small Box */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Logo *
                  </label>
                  {logoPreview ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                      <img
                        src={logoPreview}
                        className="w-full h-full object-cover"
                        alt="Company logo"
                      />
                      {uploadingLogo && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setFieldValue, 'logo')}
                        disabled={uploadingLogo}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`relative w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        isDragActiveForField('logo')
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30"
                      } ${uploadingLogo ? 'opacity-50 cursor-wait' : ''}`}
                      onDragEnter={(e) => handleDrag(e, 'logo')}
                      onDragLeave={(e) => handleDrag(e, 'logo')}
                      onDragOver={(e) => handleDrag(e, 'logo')}
                      onDrop={(e) => handleDrop(e, setFieldValue, 'logo')}
                      onClick={() => !uploadingLogo && logoInputRef.current?.click()}
                    >
                      {uploadingLogo ? (
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-400" />
                          <span className="text-xs text-slate-500 mt-1">Upload</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setFieldValue, 'logo')}
                    disabled={uploadingLogo}
                  />
                  <p className="text-xs text-slate-400 mt-1">Recommended: Square image, 200x200px</p>
                  <ErrorMessage name="companyLogo" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Company Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name *
                  </label>
                  <Field
                    type="text"
                    name="companyName"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.companyName && errors.companyName
                        ? 'border-red-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="Enter company name"
                    disabled={isLoading || isUploading}
                  />
                  <ErrorMessage name="companyName" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Country */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Country *
                  </label>
                  <Field
                    as="select"
                    name="country"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.country && errors.country
                        ? 'border-red-500'
                        : 'border-slate-300'
                    }`}
                    disabled={isLoading || isUploading}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="country" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Email */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Email *
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.email && errors.email
                        ? 'border-red-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="company@example.com"
                    disabled={isLoading || isUploading}
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Website */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Website
                  </label>
                  <Field
                    type="url"
                    name="website"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.website && errors.website
                        ? 'border-red-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="https://example.com"
                    disabled={isLoading || isUploading}
                  />
                  <ErrorMessage name="website" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* PAN Number */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    PAN Number *
                  </label>
                  <Field
                    type="text"
                    name="panNo"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.panNo && errors.panNo
                        ? 'border-red-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="ABCDE1234F"
                    disabled={isLoading || isUploading}
                  />
                  <ErrorMessage name="panNo" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Company Address */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Address *
                  </label>
                  <Field
                    as="textarea"
                    name="companyAddress"
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      touched.companyAddress && errors.companyAddress
                        ? 'border-red-500'
                        : 'border-slate-300'
                    }`}
                    placeholder="Enter complete company address"
                    disabled={isLoading || isUploading}
                  />
                  <ErrorMessage name="companyAddress" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                {/* Subscription Plan */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Subscription Plan *
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plansLoading ? (
                      <div className="col-span-3 text-sm text-slate-500">
                        Loading plans...
                      </div>
                    ) : (
                      plans.map((plan) => (
                        <label
                          key={plan.name}
                          className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                            values.plan === plan.name
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-slate-200 hover:border-indigo-300'
                          } ${(isLoading || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <input
                            type="radio"
                            name="plan"
                            value={plan.name}
                            checked={values.plan === plan.name}
                            onChange={() => setFieldValue('plan', plan.name)}
                            className="sr-only"
                            disabled={isLoading || isUploading}
                          />

                          <div className="text-center">
                            <h3 className="font-semibold text-slate-900">
                              {plan.name}
                            </h3>

                            <p className="text-lg font-bold text-indigo-600">
                              ${plan.price}
                              <span className="text-xs text-slate-500">
                                /{plan.duration} days
                              </span>
                            </p>

                            <p className="text-xs text-slate-500 mt-2">
                              {plan.features}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>

                  <ErrorMessage
                    name="plan"
                    component="div"
                    className="mt-1 text-xs text-red-500"
                  />
                </div>

                {/* Registration Document Upload - Small Box like Logo */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Registration Document *
                  </label>
                  {registrationDocumentPreview ? (
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                      {registrationDocumentPreview.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                        <img
                          src={registrationDocumentPreview}
                          className="w-full h-full object-cover"
                          alt="Registration document"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
                          <FileText className="h-8 w-8 text-slate-500" />
                          <span className="text-xs text-slate-500 mt-1">PDF Document</span>
                        </div>
                      )}
                      {uploadingDoc && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setFieldValue, 'document')}
                        disabled={uploadingDoc}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`relative w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        isDragActiveForField('document')
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30"
                      } ${uploadingDoc ? 'opacity-50 cursor-wait' : ''}`}
                      onDragEnter={(e) => handleDrag(e, 'document')}
                      onDragLeave={(e) => handleDrag(e, 'document')}
                      onDragOver={(e) => handleDrag(e, 'document')}
                      onDrop={(e) => handleDrop(e, setFieldValue, 'document')}
                      onClick={() => !uploadingDoc && documentInputRef.current?.click()}
                    >
                      {uploadingDoc ? (
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-400" />
                          <span className="text-xs text-slate-500 mt-1">Upload</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={documentInputRef}
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) => handleImageUpload(e, setFieldValue, 'document')}
                    disabled={uploadingDoc}
                  />
                  <p className="text-xs text-slate-400 mt-1">Upload certificate or license (PDF/Image)</p>
                  <ErrorMessage name="registrationDocument" component="div" className="mt-1 text-xs text-red-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={isLoading || isSubmitting || isUploading}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isLoading || isSubmitting) && <Loader2 className="h-4 w-4 animate-spin" />}
                {(isLoading || isSubmitting) ? 'Creating Company...' : 'Register Company'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};