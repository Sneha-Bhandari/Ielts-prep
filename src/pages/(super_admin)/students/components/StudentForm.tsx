import { Formik, Form, Field, ErrorMessage } from 'formik';
import { studentSchema } from '../../../../schema/student.schema';
import { Loader2, User, Mail, Save, Upload, X, Globe, Target, GraduationCap, Calendar, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { uploadFile, getFileUrl } from '../../../../lib/file-upload';
import toast, { Toaster } from 'react-hot-toast';
import type { StudentFormData } from '../../../../schema/student.schema';

interface IeltsOption {
  id: string;
  title: string;
  typeName: string;
  displayName: string;
}

interface StudentFormProps {
  onSubmit: (values: StudentFormData) => Promise<void> | void;
  isLoading: boolean;
  initialValues?: StudentFormData;
  isEditing?: boolean;
  avatarUrl?: string | null;
  companyName?: string;
  ieltsOptions?: IeltsOption[];
}

export const StudentForm = ({ 
  onSubmit, 
  isLoading, 
  initialValues,
  isEditing = false,
  avatarUrl = null,
  ieltsOptions = []
}: StudentFormProps) => {
  const navigate = useNavigate();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [existingAvatarId, setExistingAvatarId] = useState<string>('');

  const initialFormValues: StudentFormData = {
    name: initialValues?.name || '',
    email: initialValues?.email || '',
    phone: initialValues?.phone || '',
    avatar: initialValues?.avatar || '',
    country: initialValues?.country || '',
    targetBand: initialValues?.targetBand || 0,
    targetExam: initialValues?.targetExam || '',
    currentLevel: initialValues?.currentLevel || '',
    enrollmentDate: initialValues?.enrollmentDate || new Date().toISOString().slice(0, 16),
    isExternal: initialValues?.isExternal || false,

  };

  useEffect(() => {
    if (initialValues?.avatar) {
      setExistingAvatarId(initialValues.avatar);
    }
  }, [initialValues]);

  useEffect(() => {
    if (avatarUrl) {
      setAvatarPreview(avatarUrl);
    } else if (initialValues?.avatar) {
      const url = getFileUrl(initialValues.avatar);
      if (url) setAvatarPreview(url);
    }
  }, [avatarUrl, initialValues]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarUpload = async (
    file: File,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File must be under 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    
    try {
      setUploadingAvatar(true);
      setAvatarPreview(previewUrl);

      const uploadedFile = await uploadFile(file);
      setFieldValue('avatar', uploadedFile.id);
      setExistingAvatarId('');
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload avatar. Please try again.');
      setAvatarPreview('');
      setFieldValue('avatar', '');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarRemove = (setFieldValue: (field: string, value: any) => void) => {
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview('');
    setFieldValue('avatar', '');
    setExistingAvatarId('');
    if (avatarInputRef.current) avatarInputRef.current.value = '';
    toast.success('Avatar removed');
  };

  const handleSubmit = async (values: StudentFormData, { setSubmitting }: any) => {
    try {
      let avatarId = values.avatar;
      if (typeof avatarId === 'object' && avatarId !== null) {
        avatarId = (avatarId as any).id;
      }
      if (!avatarId && existingAvatarId) {
        avatarId = existingAvatarId;
      }
      const finalValues: StudentFormData = {
        ...values,
        avatar: avatarId || '',
        targetExam: values.targetExam || '',
      };
  
      await onSubmit(finalValues);
  
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.message || 'Failed to submit form. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const levelOptions = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'];

  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={studentSchema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ setFieldValue, errors, touched, isSubmitting, isValid, values }) => {
        return (
            <Form className="space-y-8">
              <Toaster position='top-right'/>
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
              {/* Avatar Upload */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Profile Picture
                </h3>
                <div className="flex items-center gap-6">
                  {avatarPreview ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 group">
                      <img
                        src={avatarPreview}
                        className="w-full h-full object-cover"
                        alt="Student avatar"
                      />
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAvatarRemove(setFieldValue)}
                        disabled={uploadingAvatar}
                        className="absolute top-4 right-4 cursor-pointer p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`relative w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-full cursor-pointer transition-all duration-200 ${
                        uploadingAvatar
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/30'
                      }`}
                      onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
                    >
                      {uploadingAvatar ? (
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
                    ref={avatarInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file, setFieldValue);
                    }}
                    disabled={uploadingAvatar}
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
                        placeholder="Enter student name"
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
                </div>
              </div>

              {/* Country & External Status */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600" />
                  Location & Status
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

                  <div className="col-span-2 sm:col-span-1 flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer pb-2">
                      <Field
                        type="checkbox"
                        name="isExternal"
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                        disabled={isLoading || isSubmitting}
                      />
                      <span className="text-sm text-slate-700">External Student</span>
                      <span className="text-xs text-slate-400">(Check if student is from outside)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-indigo-600" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Target Exam
                    </label>
                    <div className="relative">
                      <GraduationCap className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        as="select"
                        name="targetExam"
                        value={values.targetExam || ''}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.targetExam && errors.targetExam ? 'border-red-500' : 'border-slate-300'
                        }`}
                        disabled={isLoading || isSubmitting}
                      >
                        <option value="">Select exam type (optional)</option>
                        {ieltsOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.displayName}
                          </option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="targetExam" component="div" className="mt-1 text-xs text-red-500" />
                    {ieltsOptions.length === 0 && (
                      <p className="mt-1 text-xs text-amber-600">
                        No IELTS exams available. Please add IELTS data first.
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Target Band Score <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Target className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        type="number"
                        name="targetBand"
                        step="0.5"
                        min="0"
                        max="9"
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.targetBand && errors.targetBand ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="e.g., 7.5"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    <ErrorMessage name="targetBand" component="div" className="mt-1 text-xs text-red-500" />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Current Level <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Field
                        as="select"
                        name="currentLevel"
                        value={values.currentLevel}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          touched.currentLevel && errors.currentLevel ? 'border-red-500' : 'border-slate-300'
                        }`}
                        disabled={isLoading || isSubmitting}
                      >
                        <option value="">Select level</option>
                        {levelOptions.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </Field>
                    </div>
                    <ErrorMessage name="currentLevel" component="div" className="mt-1 text-xs text-red-500" />
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
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/students')}
                className="px-6 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                disabled={isLoading || isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isSubmitting || uploadingAvatar || !isValid}
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
                    {isEditing ? 'Update Student' : 'Add Student'}
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