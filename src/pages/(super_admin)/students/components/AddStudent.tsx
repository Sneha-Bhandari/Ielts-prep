// src/components/students/AddStudent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Building2, ChevronDown } from 'lucide-react';
import { StudentForm } from './StudentForm';
import { useStudentStore } from '../../../../store/student.store';
import { useAdminStore } from '../../../../store/admin.store';
import { useAppQuery, useAppMutation } from '../../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { StudentFormData } from '../../../../schema/student.schema';
import type { Admin } from '../../../../interfaces/admin.interface';
import { toast } from 'react-hot-toast';

export const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addStudent } = useStudentStore();
  const { 
    admins, 
    setAdmins, 
    currentAdmin, 
    setCurrentAdmin,
    // getCompanyId 
  } = useAdminStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');
  const [initialValues, setInitialValues] = useState<StudentFormData | null>(null);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  // Fetch admins from backend
  const { data: fetchedAdmins = [], isLoading: isLoadingAdmins } = useAppQuery<Admin[]>({
    url: "/admins",
    queryKey: ["admins"],
  });

  // Set admins in store when fetched
  useEffect(() => {
    if (fetchedAdmins.length > 0) {
      setAdmins(fetchedAdmins);
      
      // If no current admin is set, set the first one
      if (!currentAdmin && fetchedAdmins.length > 0) {
        setCurrentAdmin(fetchedAdmins[0]);
        setSelectedAdminId(fetchedAdmins[0].id);
      } else if (currentAdmin) {
        setSelectedAdminId(currentAdmin.id);
      }
    }
  }, [fetchedAdmins, setAdmins, currentAdmin, setCurrentAdmin]);

  // Get the selected admin object
  const selectedAdmin = admins.find(admin => admin.id === selectedAdminId) || currentAdmin || admins[0];

  // Initialize form values when admin is selected
  useEffect(() => {
    if (selectedAdmin) {
      const companyId = selectedAdmin.companyId || selectedAdmin.id;
      
      setInitialValues({
        name: '',
        email: '',
        phone: '', 
        avatar: '',
        country: selectedAdmin.country || '',
        targetBand: 0,
        targetExam: '',
        currentLevel: '',
        enrollmentDate: new Date().toISOString(),
        isExternal: false,
        companyId: companyId,
      });
    }
  }, [selectedAdmin]);

  // POST to backend
  const { mutate: createStudent } = useAppMutation({
    url: "/students",
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
      
      // Use the selected admin's company ID
      const companyId = selectedAdmin?.companyId || selectedAdmin?.id || '';
      
      if (!companyId) {
        toast.error('No company selected. Please select a company first.');
        setIsLoading(false);
        return;
      }

      const studentData = {
        name: values.name,
        email: values.email,
        phone: values.phone, // Include phone
        avatar: values.avatar,
        country: values.country,
        targetBand: values.targetBand,
        targetExam: values.targetExam,
        currentLevel: values.currentLevel,
        enrollmentDate: values.enrollmentDate,
        isExternal: values.isExternal,
        companyId: companyId,
      };

      console.log('Submitting student data:', studentData);
      createStudent({ data: studentData });
      
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
      setIsLoading(false);
    }
  };

  const handleAdminSelect = (admin: Admin) => {
    setCurrentAdmin(admin);
    setSelectedAdminId(admin.id);
    setShowAdminDropdown(false);
    toast.success(`Selected company: ${admin.companyName}`);
  };

  if (isLoadingAdmins) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <span className="ml-3 text-slate-500">Loading companies...</span>
      </div>
    );
  }

  if (!selectedAdmin && admins.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4 p-6">
        <Building2 className="h-16 w-16 text-slate-300" />
        <p className="text-slate-500 text-lg">No companies available</p>
        <p className="text-slate-400 text-sm">Please contact support to add a company</p>
        <button
          onClick={() => navigate('/students')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
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
            Register a new student under your company
          </p>
        </div>
      </div>

      {/* Admin/Company Selection - Only showing company name */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">Selected Company</p>
              <p className="text-sm text-slate-600">{selectedAdmin?.companyName || 'No company selected'}</p>
            </div>
          </div>
          
          {/* Admin Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAdminDropdown(!showAdminDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
              disabled={isLoading}
            >
              <span>Change Company</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdminDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showAdminDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 max-h-60 overflow-y-auto">
                {admins.map((admin) => (
                  <button
                    key={admin.id}
                    onClick={() => handleAdminSelect(admin)}
                    className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                      selectedAdminId === admin.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                    }`}
                  >
                    <span className="font-medium">{admin.companyName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <StudentForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        initialValues={initialValues}
        isEditing={false}
        companyName={selectedAdmin?.companyName || 'Not specified'}
      />
    </div>
  );
};