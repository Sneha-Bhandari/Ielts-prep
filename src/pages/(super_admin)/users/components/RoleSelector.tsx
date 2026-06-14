// import { useState } from 'react';
import { Building2, UserCircle } from 'lucide-react';

interface RoleSelectorProps {
  value: 'admin' | 'super_admin';
  onChange: (role: 'admin' | 'super_admin') => void;
}

export const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        User Role
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('admin')}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            value === 'admin'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <Building2 className={`h-5 w-5 ${value === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <div className="text-left">
            <div className="font-medium text-slate-900">Admin</div>
            <div className="text-xs text-slate-500">Can manage their organization</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('super_admin')}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
            value === 'super_admin'
              ? 'border-indigo-600 bg-indigo-50'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <UserCircle className={`h-5 w-5 ${value === 'super_admin' ? 'text-indigo-600' : 'text-slate-400'}`} />
          <div className="text-left">
            <div className="font-medium text-slate-900">Super Admin</div>
            <div className="text-xs text-slate-500">Full platform access</div>
          </div>
        </button>
      </div>
    </div>
  );
};