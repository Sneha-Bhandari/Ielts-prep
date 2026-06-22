import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminForm } from './components/AdminForm';
import { useAppMutation, useAppQuery } from '../../../lib/react-query';
import { useAdminStore } from '../../../store/admin.store';
import type { Plan } from '../../../interfaces/admin.interface';
import toast, { Toaster } from 'react-hot-toast';

const countries = [
  { id: '1', name: 'USA', code: 'US' },
  { id: '2', name: 'UK', code: 'GB' },
  { id: '3', name: 'Canada', code: 'CA' },
  { id: '4', name: 'Australia', code: 'AU' },
  { id: '5', name: 'India', code: 'IN' },
  { id: '6', name: 'Germany', code: 'DE' },
  { id: '7', name: 'Nepal', code: 'NP' },
];

export default function NewUserModel() {
  const navigate = useNavigate();
  const { addAdmin } = useAdminStore();

  const { data: plans = [], isLoading: plansLoading } = useAppQuery<Plan[]>({
    url: '/plans/',
    queryKey: ['plans'],
  });

  const { mutateAsync: createAdmin, isPending: isLoading } = useAppMutation({
    url: '/admins',
    type: 'post',
    onSuccess: (data) => {
      addAdmin(data);
      toast.success('Company created successfully!');
  
      setTimeout(() => {
        navigate('/user');
      }, 2000);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
        'Failed to create company. Please try again.'
      );
    },
  });

  const handleCreateAdmin = async (values: any) => {
    const selectedPlan = plans.find(plan => plan.name === values.plan);
  
    const payload = {
      country: values.country,
      companyName: values.companyName,
      companyAddress: values.companyAddress,
      email: values.email,
      companyLogo: values.companyLogo,
      website: values.website || null,
      panNo: values.panNo,
      registrationDocument: values.registrationDocument,
      planid: selectedPlan?.id || values.plan,
      paymentStatus: values.paymentStatus || 'pending',
      isActive: values.isActive ?? true,
    };
  
    await createAdmin({ data: payload });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster />
      <button
        onClick={() => navigate('/user')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 duration-500 transition-transform" />
        <span className="text-md font-medium cursor-pointer">Back to Company Management</span>
      </button>

      <div className="bg-white rounded-xl shadow-md border border-slate-200">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Register New Company</h2>
          <p className="text-sm text-slate-500 mt-1">Fill in the details below to register a new company</p>
        </div>
        <div className="p-6">
          <AdminForm
            onSubmit={handleCreateAdmin}
            isLoading={isLoading}
            countries={countries}
            plans={plans}
            plansLoading={plansLoading}
          />
        </div>
      </div>
    </div>
  );
}