import { Formik, Form, Field, ErrorMessage } from 'formik';
import { teacherSchema } from '../../../../schema/teacher.schema';
import { Loader2, User, Mail, Save, Upload, X, Globe, Calendar, Phone, Briefcase, FileImage } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { uploadFile, getFileUrl } from '../../../../lib/file-upload';
import toast, { Toaster } from 'react-hot-toast';
import type { TeacherFormData } from '../../../../schema/teacher.schema';

interface TeacherFormProps {
  onSubmit: (values: TeacherFormData) => Promise<void> | void;
  isLoading: boolean;
  initialValues?: TeacherFormData;
  isEditing?: boolean;
  profileUrl?: string | null;
  proofDocumentUrl?: string | null;
}

export const TeacherForm = ({ 
  onSubmit, 
  isLoading, 
  initialValues,
  isEditing = false,
  profileUrl = null,
  proofDocumentUrl = null
}: TeacherFormProps) => {
  const navigate = useNavigate();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [existingProfileId, setExistingProfileId] = useState<string>('');

  const [proofPreview, setProofPreview] = useState<string>('');
  const [uploadingProof, setUploadingProof] = useState(false);
  const [existingProofId, setExistingProofId] = useState<string>('');

  const initialFormValues: TeacherFormData = {
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    profile: initialValues?.profile || '',
    country: initialValues?.country || '',
    role: initialValues?.role || 'teacher',
    enrollmentDate: initialValues?.enrollmentDate || new Date().toISOString().slice(0, 16),
    proofDocument: initialValues?.proofDocument || '',
  };

  // Profile image effects
  useEffect(() => {
    if (initialValues?.profile) {
      setExistingProfileId(initialValues.profile);
    }
  }, [initialValues]);

  useEffect(() => {
    if (profileUrl) {
      setProfilePreview(profileUrl);
    } else if (initialValues?.profile) {
      const url = getFileUrl(initialValues.profile);
      if (url) setProfilePreview(url);
    }
  }, [profileUrl, initialValues]);

  // Proof document effects
  useEffect(() => {
    if (initialValues?.proofDocument) {
      setExistingProofId(initialValues.proofDocument);
    }
  }, [initialValues]);

  useEffect(() => {
    if (proofDocumentUrl) {
      setProofPreview(proofDocumentUrl);
    } else if (initialValues?.proofDocument) {
      const url = getFileUrl(initialValues.proofDocument);
      if (url) setProofPreview(url);
    }
  }, [proofDocumentUrl, initialValues]);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      if (proofPreview && proofPreview.startsWith('blob:')) {
        URL.revokeObjectURL(proofPreview);
      }
    };
  }, [profilePreview, proofPreview]);

  const handleProfileUpload = async (
    file: File,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    
    try {
      setUploadingProfile(true);
      setProfilePreview(previewUrl);

      const uploadedFile = await uploadFile(file);
      setFieldValue('profile', uploadedFile.id);
      setExistingProfileId('');
      toast.success('Profile picture uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload profile picture. Please try again.');
      setProfilePreview('');
      setFieldValue('profile', '');
    } finally {
      setUploadingProfile(false);
    }
  };

  const handleProfileRemove = (setFieldValue: (field: string, value: any) => void) => {
    if (profilePreview && profilePreview.startsWith('blob:')) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfilePreview('');
    setFieldValue('profile', '');
    setExistingProfileId('');
    if (profileInputRef.current) profileInputRef.current.value = '';
    toast.success('Profile picture removed');
  };

  const handleProofUpload = async (
    file: File,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File must be under 10MB');
      return;
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    
    try {
      setUploadingProof(true);
      setProofPreview(previewUrl);

      const uploadedFile = await uploadFile(file);
      setFieldValue('proofDocument', uploadedFile.id);
      setExistingProofId('');
      toast.success('Proof document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload proof document. Please try again.');
      setProofPreview('');
      setFieldValue('proofDocument', '');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleProofRemove = (setFieldValue: (field: string, value: any) => void) => {
    if (proofPreview && proofPreview.startsWith('blob:')) {
      URL.revokeObjectURL(proofPreview);
    }
    setProofPreview('');
    setFieldValue('proofDocument', '');
    setExistingProofId('');
    if (proofInputRef.current) proofInputRef.current.value = '';
    toast.success('Proof document removed');
  };

  const handleSubmit = async (values: TeacherFormData, { setSubmitting }: any) => {
    try {
      let profileId = values.profile;
      if (typeof profileId === 'object' && profileId !== null) {
        profileId = (profileId as any).id;
      }
      if (!profileId && existingProfileId) {
        profileId = existingProfileId;
      }

      let proofId = values.proofDocument;
      if (typeof proofId === 'object' && proofId !== null) {
        proofId = (proofId as any).id;
      }
      if (!proofId && existingProofId) {
        proofId = existingProofId;
      }

      const finalValues: TeacherFormData = {
        ...values,
        profile: profileId || '',
        proofDocument: proofId || '',
      };

      await onSubmit(finalValues);
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.message || 'Failed to submit form. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'teacher', label: 'Teacher' },
    { value: 'counselor', label: 'Counselor' },
  ];

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={teacherSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ setFieldValue, errors, touched, isSubmitting, isValid }) => {
        return (
          <Form className="space-y-8 font-aeonik">
            <Toaster position='top-right' />
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              {/* Profile Picture Upload */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-6">
                  {profilePreview ? (
                    <div className="relative w-32 h-32  rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                      <img
                        src={profilePreview}
                        className="w-full h-full object-cover"
                        alt="Teacher profile"
                      />
                      {uploadingProfile && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleProfileRemove(setFieldValue)}
                        disabled={uploadingProfile}
                        className="absolute top-4 right-4 p-1  bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-3 h-3 " />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`relative w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-full cursor-pointer transition-all duration-200 ${
                        uploadingProfile
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => !uploadingProfile && profileInputRef.current?.click()}
                    >
                      {uploadingProfile ? (
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-slate-400" />
                          <span className="text-xs text-slate-500 mt-1">Upload</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={profileInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProfileUpload(file, setFieldValue);
                    }}
                    disabled={uploadingProfile}
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        type="text"
                        name="name"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.name && errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter teacher name"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        type="email"
                        name="email"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.email && errors.email ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter email address"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-500" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        type="text"
                        name="phone"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.phone && errors.phone ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter phone number"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    <ErrorMessage name="phone" component="div" className="mt-1 text-xs text-red-500" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Globe className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        type="text"
                        name="country"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.country && errors.country ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Enter country name"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    <ErrorMessage name="country" component="div" className="mt-1 text-xs text-red-500" />
                  </div>
                </div>
              </div>

              {/* Role & Employment Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  Role & Employment
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        as="select"
                        name="role"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.role && errors.role ? 'border-red-500' : 'border-slate-300'
                        }`}
                        disabled={isLoading || isSubmitting}
                      >
                        {roleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="role" component="div" className="mt-1 text-xs text-red-500" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Enrollment Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        type="datetime-local"
                        name="enrollmentDate"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.enrollmentDate && errors.enrollmentDate ? 'border-red-500' : 'border-slate-300'
                        }`}
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    <ErrorMessage name="enrollmentDate" component="div" className="mt-1 text-xs text-red-500" />
                  </div>
                </div>
              </div>

              {/* Proof Document - Image Upload */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileImage className="h-5 w-5 text-indigo-600" />
                  Proof Document
                </h3>
                <div className="flex items-start gap-6">
                  {proofPreview ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                      <img
                        src={proofPreview}
                        className="w-full h-full object-contain"
                        alt="Proof document"
                      />
                      {uploadingProof && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleProofRemove(setFieldValue)}
                        disabled={uploadingProof}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`relative w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                        uploadingProof
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => !uploadingProof && proofInputRef.current?.click()}
                    >
                      {uploadingProof ? (
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
                    ref={proofInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleProofUpload(file, setFieldValue);
                    }}
                    disabled={uploadingProof}
                  />
                 
                </div>
                <ErrorMessage name="proofDocument" component="div" className="mt-1 text-xs text-red-500" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/teachers')}
                className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSubmitting || uploadingProfile || uploadingProof || !isValid}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isLoading || isSubmitting) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {isEditing ? 'Update Teacher' : 'Add Teacher'}
                  </>
                )}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};