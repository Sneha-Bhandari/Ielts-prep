import { useState } from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminForm } from './components/AdminForm';
import { useCreateAdmin, useGetCompanies } from '../../../hook/useCreateAdmin';

export default function NewUserModel() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const createAdminMutation = useCreateAdmin();
  const { data: companies = []} = useGetCompanies();

  const handleCreateAdmin = async (values: any) => {
    try {
      await createAdminMutation.mutateAsync(values);
      setSuccessMessage('Admin created successfully! An email has been sent to the admin.');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form or navigate
        // navigate('/user');
      }, 5000);
    } catch (error: any) {
      console.error('Error creating admin:', error);
      alert(error.response?.data?.message || 'Failed to create admin');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate('/user')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 duration-500 transition-transform" />
        <span className="text-md font-medium cursor-pointer">Back to User Management</span>
      </button>

      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-top-2">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-xl  shadow-md">
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-indigo-600" />
            <h2 className="page-title">Create New Admin</h2>
          </div>
          <p className="page-subtitle">
            Fill in the details below to create a new admin user
          </p>
        </div>

        <div className="p-6">
          <AdminForm
            onSubmit={handleCreateAdmin}
            isLoading={createAdminMutation.isPending}
            companies={companies}
          />
        </div>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h3 className="font-medium text-brand-light mb-1">📝 Admin Creation</h3>
        <p className="text-xs text-brand">
          Create admin users who can manage their organization's dashboard, students, teachers, and counsellors.
          The admin will receive login credentials via email.
        </p>
      </div>
    </div>
  );
}