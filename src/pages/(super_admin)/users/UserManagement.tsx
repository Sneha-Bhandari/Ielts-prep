// UserManagement.tsx
import { useState } from 'react';
import { UserPlus, Eye, Trash2, Building, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserCards from './components/UserCards';
import { useAdminStore } from '../../../store/admin.store';
import { useAppQuery, useAppMutation } from '../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { Admin } from '../../../interfaces/admin.interface';
import Pagination from '../../../components/UI/Pagination';

export default function UserManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { admins, deleteAdmin } = useAdminStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH ADMINS
  const { data: fetchedAdmins = [], isLoading } = useAppQuery<Admin[]>({
    url: "/admins",
    queryKey: ["admins"],
  });

  // DELETE ADMIN
  const { mutate: deleteAdminApi } = useAppMutation({
    url: "/admins",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const safeAdmins = fetchedAdmins.length > 0 ? fetchedAdmins : admins;

  // Filter users based on search and status
  const filteredUsers = safeAdmins.filter(admin => {
    const companyName = admin?.companyName || '';
    const email = admin?.email || '';
    const country = admin?.country || '';
    const isActive = admin?.isActive;
    
    const matchesSearch = companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'active') matchesStatus = isActive === true;
    if (filterStatus === 'inactive') matchesStatus = isActive === false;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-700' 
      : 'bg-red-100 text-red-700';
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleDelete = (id: string) => {
    deleteAdminApi({ id });
    deleteAdmin(id);
    setShowDeleteModal(null);
  };

  // Get logo URL from companyLogoId object
  const getLogoUrl = (admin: any) => {
    if (admin?.companyLogoId?.url) {
      return admin.companyLogoId.url;
    }
    if (admin?.companyLogoId && typeof admin.companyLogoId === 'object') {
      return admin.companyLogoId.url || null;
    }
    if (typeof admin?.companyLogoId === 'string') {
      if (admin.companyLogoId.startsWith('http')) {
        return admin.companyLogoId;
      }
      return `${import.meta.env.VITE_API_URL}${admin.companyLogoId}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
        <h1 className="text-slate-500">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserCards users={safeAdmins} />
      
      <div className="flex justify-end items-center">
        <button
          onClick={() => navigate('/user/new')}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700/90 transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Company</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by company name, email or country..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">SN</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">PAN Number</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentItems.map((admin, index) => {
                const logoUrl = getLogoUrl(admin);
                const globalIndex = startIndex + index + 1;
                
                return (
                  <tr key={admin.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 text-sm text-slate-600">{globalIndex}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {logoUrl ? (
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            <img 
                              src={logoUrl} 
                              alt={admin.companyName} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', logoUrl);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200">
                            <Building className="h-5 w-5 text-indigo-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-900">{admin.companyName}</div>
                          <div className="text-xs text-slate-500">{admin.country}</div>
                          <div className="text-xs text-slate-400">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-slate-600">{admin.panNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 capitalize">
                        {admin?.plan?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(admin.paymentStatus)} capitalize`}>
                        {admin.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(admin.isActive)}`}>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => navigate(`/user/${admin.id}`)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setShowDeleteModal(admin.id!)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No companies found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">Delete Company</h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                Are you sure you want to delete this company? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}