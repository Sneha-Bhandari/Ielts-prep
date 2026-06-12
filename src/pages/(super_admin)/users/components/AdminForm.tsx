import { useFormik } from 'formik';
import { adminSchema } from '../../../../schema/adminSchema';
import type { AdminFormValues } from '../../../../interfaces/admin';
import { Loader2 } from 'lucide-react';

interface AdminFormProps {
  onSubmit: (values: AdminFormValues) => void;
  isLoading: boolean;
  companies: Array<{ id: string; name: string }>;
}

export const AdminForm = ({ onSubmit, isLoading, companies = [] }: AdminFormProps) => {
  const formik = useFormik<AdminFormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      companyId: '',
      password: '',
      confirmPassword: '',
      role: 'admin',
    },
    validationSchema: adminSchema,
    onSubmit,
  });

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 
    'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 
    'Finland', 'France', 'Germany', 'Greece', 'Hong Kong', 'India', 'Indonesia', 
    'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kuwait', 
    'Lebanon', 'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'Netherlands', 
    'New Zealand', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Philippines', 
    'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 
    'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 
    'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Thailand', 'Tunisia', 'Turkey', 
    'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 
    'Vietnam', 'Yemen'
  ];

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 page-subtitle">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.name && formik.errors.name
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            placeholder="User Name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            placeholder="admin@example.com"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.phone && formik.errors.phone
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            placeholder="9876543210"
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Country *
          </label>
          <select
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.country && formik.errors.country
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {formik.touched.country && formik.errors.country && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.country}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Assign Company *
          </label>
          <select
            name="companyId"
            value={formik.values.companyId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.companyId && formik.errors.companyId
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          {formik.touched.companyId && formik.errors.companyId && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.companyId}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            placeholder="••••••••"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            placeholder="••••••••"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-brand-footer-left text-white py-2 px-4 rounded-lg hover:bg-brand/90 transition-colors cursor-pointer duration-500 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating Admin...' : 'Create Admin'}
        </button>
        <button
          type="button"
          onClick={() => formik.resetForm()}
          className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>
    </form>
  );
};