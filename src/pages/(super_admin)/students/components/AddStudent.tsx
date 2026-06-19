// src/components/students/AddStudent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { StudentForm } from './StudentForm';
import { useStudentStore } from '../../../../store/student.store';
import { useAppQuery, useAppMutation } from '../../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { StudentFormData } from '../../../../schema/student.schema';
import { toast } from 'react-hot-toast';

// Interface for IELTS response
interface IeltsType {
  id: string;
  name: string;
  description: string;
}

interface IeltsResponse {
  id: string;
  title: string;
  description: string;
  ieltsType: IeltsType;
  thumbnail: any;
  isPublished: boolean;
  price: string;
  sections: any[];
}

// Update the option interface to include title and type name
interface IeltsOption {
  id: string;
  title: string;
  typeName: string;
  displayName: string; // Combined display name
}

export const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addStudent } = useStudentStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<StudentFormData | null>(null);
  const [ieltsOptions, setIeltsOptions] = useState<IeltsOption[]>([]);

  // Fetch IELTS data from backend
  const { data: fetchedIelts = [], isLoading: isLoadingIelts } = useAppQuery<IeltsResponse[]>({
    url: "/ielts/published",
    queryKey: ["ielts"],
  });

  // Extract IELTS options from fetched data - show title with type name
  useEffect(() => {
    if (fetchedIelts.length > 0) {
      // Create options with combined display name
      const options = fetchedIelts.map((ielts) => ({
        id: ielts.id, // Use the IELTS ID as the value
        title: ielts.title,
        typeName: ielts.ieltsType?.name || 'Unknown Type',
        displayName: `${ielts.title} (${ielts.ieltsType?.name || 'Unknown Type'})`
      }));
      
      setIeltsOptions(options);
    }
  }, [fetchedIelts]);

  // Initialize form values
  useEffect(() => {
    setInitialValues({
      name: '',
      email: '',
      phone: '', 
      avatar: '',
      country: '',
      targetBand: 0,
      targetExam: '', // Will be set from dropdown
      currentLevel: '',
      enrollmentDate: new Date().toISOString(),
      isExternal: false,
    });
  }, []);

  // POST to backend
  const { mutate: createStudent } = useAppMutation({
    url: "/students/",
    type: "post",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      
      if (data) {
        addStudent(data);
      }
      
      toast.success('Student added successfully!');
      navigate('/students');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add student');
      setIsLoading(false);
    },
  });

  const handleSubmit = async (values: StudentFormData) => {
    try {
      setIsLoading(true);

      const studentData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatar: values.avatar,
        country: values.country,
        targetBand: values.targetBand,
        targetExam: values.targetExam || '', // Send the IELTS ID
        currentLevel: values.currentLevel,
        enrollmentDate: values.enrollmentDate,
        isExternal: values.isExternal,
      };

      console.log('Submitting student data:', studentData);
      createStudent({ data: studentData });
      
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
      setIsLoading(false);
    }
  };

  if (isLoadingIelts) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <span className="ml-3 text-slate-500">Loading data...</span>
      </div>
    );
  }

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
          onClick={() => navigate('/students')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900">Add New Student</h1>
          <p className="text-sm text-slate-500 mt-1">
            Register a new student
          </p>
        </div>
      </div>

      <StudentForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialValues={initialValues}
        isEditing={false}
        ieltsOptions={ieltsOptions}
      />
    </div>
  );
};