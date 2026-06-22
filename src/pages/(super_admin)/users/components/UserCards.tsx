import { Users, UserCheck, DollarSign } from 'lucide-react';
import type { Admin } from '../../../../interfaces/admin.interface';

interface UserCardsProps {
  users: Admin[];
}

export default function UserCards({ users }: UserCardsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive === true).length;
  const completedPayments = users.filter(u => u.paymentStatus === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Companies</p>
            <p className="text-2xl font-bold text-slate-900">{totalUsers}</p>
          </div>
          <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Active Companies</p>
            <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Completed Payments</p>
            <p className="text-2xl font-bold text-emerald-600">{completedPayments}</p>
          </div>
          <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}