import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TeacherForm } from './TeacherForm';
import { useTeacherStore } from '../../../../store/teacher.store';
import { useAppMutation } from '../../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { TeacherFormData } from '../../../../schema/teacher.schema';
import { toast } from 'react-hot-toast';

export const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addTeacher } = useTeacherStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<TeacherFormData | null>(null);
const userId= 
  // Initialize form values
  useEffect(() => {
    setInitialValues({
      name: '',
      email: '',
      phone: '',
      profile: '',
      country: '',
      role: 'teacher',
      enrollmentDate: new Date().toISOString().slice(0, 16),
      proofDocument: '',
    });
  }, []);

  // POST to backend
  const { mutate: createTeacher } = useAppMutation({
    url: `/teachers/${userId}`,
    type: "post",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      
      if (data) {
        addTeacher(data);
      }
      
      toast.success('Teacher added successfully!');
      navigate('/teachers');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add teacher');
      setIsLoading(false);
    },
  });

  const handleSubmit = async (values: TeacherFormData) => {
    try {
      setIsLoading(true);

      const teacherData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        profile: values.profile,
        country: values.country,
        role: values.role,
        enrollmentDate: values.enrollmentDate,
        proofDocument: values.proofDocument,
      };

      console.log('Submitting teacher data:', teacherData);
      createTeacher({ data: teacherData });
      
    } catch (error) {
      console.error('Error adding teacher:', error);
      toast.error('Failed to add teacher');
      setIsLoading(false);
    }
  };

  if (!initialValues) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/teachers')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="page-title">Add New Teacher</h1>
          <p className="page-subtitle">
            Register a new teacher or counselor
          </p>
        </div>
      </div>

      <TeacherForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialValues={initialValues}
        isEditing={false}
      />
    </div>
  );
};