// src/components/students/EditStudent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { StudentForm } from './StudentForm';
import { useStudentStore } from '../../../../store/student.store';
import { useAdminStore } from '../../../../store/admin.store';
import { useAppQuery, useAppMutation } from '../../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { getFileUrl } from '../../../../lib/file-upload';
import type { Student } from '../../../../interfaces/student.interface';
import type { StudentFormData } from '../../../../schema/student.schema';
import toast from 'react-hot-toast';

export const EditStudent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { getStudentById, updateStudent } = useStudentStore();
  const { getCompanyId, admins, currentAdmin } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialValues, setInitialValues] = useState<StudentFormData | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');

  const { 
    data: studentData, 
    isLoading: isFetching,
    error: fetchError,
    refetch 
  } = useAppQuery<Student>({
    url: id ? `/students/${id}` : "",
    queryKey: ["student", id || ""],
    enabled: !!id,
  });

  const { mutate: updateStudentApi, isPending: isUpdating } = useAppMutation({
    url: `/students`,
    type: "patch",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      
      if (data) {
        updateStudent(id!, data);
      }
      
      toast.success('Student updated successfully!');
      navigate('/students');
    },
    onError: (error: any) => {
      console.error('Update error:', error);
      toast.error(error?.response?.data?.message || 'Failed to update student');
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (studentData) {
      console.log('Student data loaded:', studentData);
      
      const companyId = studentData.companyId || getCompanyId() || admins[0]?.companyId || '';
      
      const admin = admins.find(a => a.companyId === companyId || a.id === companyId);
      setCompanyName(admin?.companyName || currentAdmin?.companyName || 'Not specified');
      
      // Convert targetBand from string to number for the form
      const targetBandNum = typeof studentData.targetBand === 'string' 
        ? parseFloat(studentData.targetBand) 
        : Number(studentData.targetBand) || 0;
      
      setInitialValues({
        name: studentData.name || '',
        email: studentData.email || '',
        phone: studentData.phone || '',
        avatar: studentData.avatar || '',
        country: studentData.country || '',
        targetBand: targetBandNum,
        targetExam: studentData.targetExam || '',
        currentLevel: studentData.currentLevel || '',
        enrollmentDate: studentData.enrollmentDate 
          ? new Date(studentData.enrollmentDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        isExternal: studentData.isExternal || false,
        companyId: companyId,
      });
      
      if (studentData.avatar) {
        const url = getFileUrl(studentData.avatar);
        if (url) setAvatarUrl(url);
      }
      setIsLoading(false);
    }
  }, [studentData, getCompanyId, admins, currentAdmin]);

  useEffect(() => {
    if (!isFetching && !studentData && id) {
      const student = getStudentById(id);
      if (student) {
        console.log('Using student from store:', student);
        const companyId = student.companyId || getCompanyId() || admins[0]?.companyId || '';
        
        const admin = admins.find(a => a.companyId === companyId || a.id === companyId);
        setCompanyName(admin?.companyName || currentAdmin?.companyName || 'Not specified');
        
        const targetBandNum = typeof student.targetBand === 'string' 
          ? parseFloat(student.targetBand) 
          : Number(student.targetBand) || 0;
        
        setInitialValues({
          name: student.name || '',
          email: student.email || '',
          phone: student.phone || '',
          avatar: student.avatar || '',
          country: student.country || '',
          targetBand: targetBandNum,
          targetExam: student.targetExam || '',
          currentLevel: student.currentLevel || '',
          enrollmentDate: student.enrollmentDate 
            ? new Date(student.enrollmentDate).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          isExternal: student.isExternal || false,
          companyId: companyId,
        });
        if (student.avatar) {
          const url = getFileUrl(student.avatar);
          if (url) setAvatarUrl(url);
        }
        setIsLoading(false);
      } else if (!isFetching) {
        toast.error('Student not found');
        navigate('/students');
      }
    }
  }, [isFetching, studentData, id, getStudentById, navigate, getCompanyId, admins, currentAdmin]);

  useEffect(() => {
    if (fetchError) {
      console.error('Error fetching student:', fetchError);
      if (id) {
        const student = getStudentById(id);
        if (student) {
          console.log('Using student from store after API error:', student);
          const companyId = student.companyId || getCompanyId() || admins[0]?.companyId || '';
          
          const admin = admins.find(a => a.companyId === companyId || a.id === companyId);
          setCompanyName(admin?.companyName || currentAdmin?.companyName || 'Not specified');
          
          const targetBandNum = typeof student.targetBand === 'string' 
            ? parseFloat(student.targetBand) 
            : Number(student.targetBand) || 0;
          
          setInitialValues({
            name: student.name || '',
            email: student.email || '',
            phone: student.phone || '',
            avatar: student.avatar || '',
            country: student.country || '',
            targetBand: targetBandNum,
            targetExam: student.targetExam || '',
            currentLevel: student.currentLevel || '',
            enrollmentDate: student.enrollmentDate 
              ? new Date(student.enrollmentDate).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            isExternal: student.isExternal || false,
            companyId: companyId,
          });
          if (student.avatar) {
            const url = getFileUrl(student.avatar);
            if (url) setAvatarUrl(url);
          }
          setIsLoading(false);
        } else {
          toast.error('Failed to load student data');
        }
      }
    }
  }, [fetchError, id, getStudentById, getCompanyId, admins, currentAdmin]);

 // src/components/students/EditStudent.tsx - Update handleSubmit

const handleSubmit = async (values: StudentFormData) => {
    try {
      setIsSaving(true);
      
      // Ensure companyId is always set
      const companyId = values.companyId || getCompanyId() || admins[0]?.companyId || '';
      
      if (!companyId) {
        toast.error('No company ID available');
        setIsSaving(false);
        return;
      }
  
      const currentStudent = studentData || getStudentById(id!);
      
      // Ensure avatar is preserved
      let avatarId = values.avatar;
      if (!avatarId && currentStudent?.avatar) {
        avatarId = currentStudent.avatar;
      }
      
      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatarid: avatarId || null,
        country: values.country,
        targetBand: values.targetBand, 
        targetExam: values.targetExam,
        currentLevel: values.currentLevel,
        enrollmentDate: values.enrollmentDate,
        isExternal: values.isExternal,
        companyId: companyId, // Ensure companyId is always included
      };
  
      console.log('Updating student with data:', updateData);
      
      updateStudentApi({ 
        id: id!, 
        data: updateData
      });
      
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
      setIsSaving(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading student data...</p>
      </div>
    );
  }

  if (fetchError && !initialValues) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4 p-6">
        <div className="text-red-500 text-lg">⚠️ Failed to load student data</div>
        <p className="text-slate-500 text-sm">{(fetchError as any)?.message || 'Please try again'}</p>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/students')}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/students')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          disabled={isSaving || isUpdating}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Student</h1>
          <p className="text-sm text-slate-500 mt-1">Update student information</p>
        </div>
      </div>

      {initialValues && (
        <StudentForm
          onSubmit={handleSubmit}
          isLoading={isSaving || isUpdating}
          initialValues={initialValues}
          isEditing={true}
          avatarUrl={avatarUrl}
          companyName={companyName}
        />
      )}
    </div>
  );
};